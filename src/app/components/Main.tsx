"use client";
import React, { useState, useEffect } from "react";

export default function Main() {
	const [blockPosition, setBlockPosition] = useState({ row: 0, col: 5 }); // ブロックの初期位置
	const [isGameRunning, setIsGameRunning] = useState(true); // ゲームの実行状態

	type BlockShape = number[][];
	type BlockTypes = "I" | "O" | "T" | "S" | "Z" | "L" | "J";
	const BLOCKS: Record<BlockTypes, BlockShape> = {
		I:[
			[0,0,0,0],
			[1,1,1,1],
			[0,0,0,0],
			[0,0,0,0],
		],
		O:[
			[1,1],
			[1,1],
		],
		T:[
			[0,1,0],
			[1,1,1],
			[0,0,0],
		],
		S:[
			[0,1,1],
			[1,1,0],
			[0,0,0],
		],
		Z:[
			[1,1,0],
			[0,1,1],
			[0,0,0],
		],
		L:[
			[1,0,0],
			[1,1,1],
			[0,0,0],
		],
		J:[
			[0,0,1],
			[1,1,1],
			[0,0,0],
		],
	}; // 変数にブロックの形を宣言

	// ミノによっての色の指定をしている
	const getColorForBlockType = (type: BlockTypes | null): string => {
		switch (type) {
			case "I": return "cyan";
			case "O": return "yellow";
			case "T": return "purple";
			case "S": return "green";
			case "Z": return "red";
			case "L": return "orange";
			case "J": return "blue";
			default: return "white";
		}
	};

	// ランダムにブロック選んで、その形状と種類を返す関数
	const getRandomBlock = (): { shape: BlockShape; type: BlockTypes } => {
		const blockTypes: BlockTypes[] = ["I","O","T","S","Z","L","J"];
		const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
		return { shape: BLOCKS[randomType], type: randomType };
	}

	type CurrentBlock = {
		shape: BlockShape;
		position: { row: number; col: number };
		type: BlockTypes;
	}; // 現在操作しているブロックの情報を表している

	const [currentBlock, setCurrentBlock] = useState<CurrentBlock>(() => {
		const randomBlock = getRandomBlock();
		return {
		  shape: randomBlock.shape,
		  position: { row: 0, col: 3 },
		  type: randomBlock.type,
		};
	});

	// 矢印キーによるブロック移動を行うための関数
	const handleKeyDown = (e: KeyboardEvent) => {
	  setCurrentBlock((prev) => {
		let newPosition = { ...prev.position };
  
		if (e.key === "ArrowLeft") newPosition.col = Math.max(0, newPosition.col - 1); // 左移動
		if (e.key === "ArrowRight") newPosition.col = Math.min(10 - prev.shape[0].length, newPosition.col + 1); // 右移動
		if (e.key === "ArrowDown") newPosition.row = Math.min(20 - prev.shape.length, newPosition.row + 1); // 下移動
  
		return { ...prev, position: newPosition };
	  });
	};

	// 固定されたブロックの状態を管理する2次元配列
	const [fixedBlocks, setFixedBlocks] = useState<Array<Array<{ type: BlockTypes | null }>>>(
		Array.from({ length: 20 }, () =>
			Array.from({ length: 10 }, () => ({ type: null }))
		)
	);

	// 衝突判定についての関数
	const checkCollision = (): boolean => {
		const { shape, position } = currentBlock;
	
		for (let row = 0; row < shape.length; row++) {
		    for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col] === 1) {
			  		const gridRow = position.row + row;
			  		const gridCol = position.col + col;

					if (gridRow >= 20 || gridCol < 0 || gridCol >= 10 || fixedBlocks[gridRow]?.[gridCol]?.type !== null ) {
					return true;
					}
				}
		  	}
		}
		return false;
	  };

    // 固定ブロックに現在のブロックを追加
	const fixBlock = () => {
		setFixedBlocks((prev) => {
		  	const updated = prev.map((row) => row.map((cell) => ({ ...cell })));
	
		  	currentBlock.shape.forEach((blockRow, rowIndex) => {
				blockRow.forEach((cell, colIndex) => {
			    	if (cell === 1) {
				    	const gridRow = currentBlock.position.row + rowIndex;
						const gridCol = currentBlock.position.col + colIndex;
					if (gridRow < 20 && gridCol >= 0 && gridCol < 10) {
						updated[gridRow][gridCol] = { type: currentBlock.type }
					}}
				});
			});
			return updated;
		});

		// 次のブロックを生成する
		const randomBlock = getRandomBlock();
		setCurrentBlock({
		  	shape: randomBlock.shape,
			position: { row: 0, col: 3 },
		  	type: randomBlock.type,
		});
	};

	// ライン消去処理
	const clearLines = () => {
		setFixedBlocks((prev) => {
		   	const updated = prev.filter((row) => row.some((cell) => cell.type === null));
		 	const linesCleared = 20 - updated.length;
		  	const newRows = Array.from({ length: linesCleared }, () => Array(10).fill(0));
	
		  	return [...newRows, ...updated];
		});
	};

	// ミノが自然に落下するようにするための処理
	useEffect(() => {
	  if (!isGameRunning) return;
  
	  const interval = setInterval(() => {
		setCurrentBlock((prev) => {
			const newPosition = { ...prev.position, row: prev.position.row + 1 };

			if (checkCollision()) {
				fixBlock();
				clearLines();
				return prev; //衝突時はその場で停止
			}

			return { ...prev, position: newPosition };
		});
	  }, 1000); // 1000ミリ秒ごとに1マス下に移動
  
	  // クリーンアップ処理
	  return () => clearInterval(interval);
	}, [isGameRunning, currentBlock]);
  
	// キー入力イベントリスナー
	useEffect(() => {
	  window.addEventListener("keydown", handleKeyDown);
	  return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// ブロックを描画するための関数
	const renderGrid = () => {
		const grid: string[][] = Array.from({ length: 20 }, () => Array(10).fill("white"));

		//固定させたブロックを反映させている
		fixedBlocks.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				if (cell.type !== null) {
					grid[rowIndex][colIndex] = getColorForBlockType(cell.type);
				}
			});
		});

		//現在のブロックを反映させている
		currentBlock.shape.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				if (cell === 1) {
					const gridRow = currentBlock.position.row + rowIndex;
					const gridCol = currentBlock.position.col + colIndex;
					if (gridRow >= 0 && gridRow < 20 && gridCol >= 0 && gridCol < 10) {
						grid[gridRow][gridCol] = getColorForBlockType(currentBlock.type);
					}
				}
			});
		});
		return grid;
	};

	const grid = renderGrid();

	return (
	  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
		<h1>Tetris</h1>
		<div
		  style={{
			display: "grid",
			gridTemplateRows: "repeat(20, 20px)",
			gridTemplateColumns: "repeat(10, 20px)",
			border: "2px solid black",
		  }}
		>
		  {grid.map((row, rowIndex) => row.map((cell, colIndex) => (
			<div
				key={`${rowIndex}-${colIndex}`}
				style={{
					width: "20px",
					height: "20px",
					backgroundColor: cell,
					border: "1px solid gray",
				}}
				></div>
			))
		)}
		</div>
		<button onClick={() => setIsGameRunning((prev) => !prev)}>
		  {isGameRunning ? "Pause" : "Resume"}
		</button>
		<p>Score: 0</p>
	  </div>
	);
  };