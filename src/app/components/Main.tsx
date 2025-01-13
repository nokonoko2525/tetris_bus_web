"use client";
import React, { useState, useEffect } from "react";

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

type BlockShape = number[][];
type BlockTypes = "I" | "O" | "T" | "S" | "Z" | "L" | "J";

const BLOCKS: Record<BlockTypes, BlockShape> = {
I: [
	[0, 0, 0, 0],
	[1, 1, 1, 1],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
],
O: [
	[1, 1],
	[1, 1],
],
T: [
	[0, 1, 0],
	[1, 1, 1],
	[0, 0, 0],
],
S: [
	[0, 1, 1],
	[1, 1, 0],
	[0, 0, 0],
],
Z: [
	[1, 1, 0],
	[0, 1, 1],
	[0, 0, 0],
],
L: [
	[1, 0, 0],
	[1, 1, 1],
	[0, 0, 0],
],
J: [
	[0, 0, 1],
	[1, 1, 1],
	[0, 0, 0],
],
};

const getRandomBlock = (): { shape: BlockShape; type: BlockTypes } => {
const types: BlockTypes[] = ["I", "O", "T", "S", "Z", "L", "J"];
const type = types[Math.floor(Math.random() * types.length)];
return { shape: BLOCKS[type], type };
};

const getColorForBlockType = (type: BlockTypes | null): string => {
switch (type) {
	case "I":
	return "cyan";
	case "O":
	return "yellow";
	case "T":
	return "purple";
	case "S":
	return "green";
	case "Z":
	return "red";
	case "L":
	return "orange";
	case "J":
	return "blue";
	default:
	return "white";
}
};

const Main: React.FC = () => {
const [board, setBoard] = useState<BlockTypes[][]>(
	Array.from({ length: ROWS }, () => Array(COLS).fill(null))
);
const [currentBlock, setCurrentBlock] = useState(() => {
	const randomBlock = getRandomBlock();
	return { shape: randomBlock.shape, type: randomBlock.type, row: 0, col: 3 };
});
const [isGameOver, setIsGameOver] = useState(false);
const [score, setScore] = useState(0);
const [level, setLevel] = useState(1);
const [nextBlock, setNextBlock] = useState(getRandomBlock);
const [intervalTime, setIntervalTime] = useState(1000);

const checkCollision = (
	shape: BlockShape,
	pos: { row: number; col: number }
): boolean => {
	for (let r = 0; r < shape.length; r++) {
	for (let c = 0; c < shape[r].length; c++) {
		if (
		shape[r][c] === 1 &&
		(pos.row + r >= ROWS ||
			pos.col + c < 0 ||
			pos.col + c >= COLS ||
			(pos.row + r >= 0 &&
			board[pos.row + r][pos.col + c] !== null))
		) {
		return true;
		}
	}
	}
	return false;
};

const rotateBlock = (shape: BlockShape): BlockShape => {
	const size = shape.length;
	const rotated = Array.from({ length: size }, () =>
	Array(size).fill(0)
	) as BlockShape;
	for (let row = 0; row < size; row++) {
	for (let col = 0; col < size; col++) {
		rotated[col][size - row - 1] = shape[row][col];
	}
	}
	return rotated;
};

const fixBlockToBoard = () => {
	setBoard((prev) => {
	const newBoard = prev.map((row) => [...row]);
	currentBlock.shape.forEach((row, rIdx) => {
		row.forEach((cell, cIdx) => {
		if (cell === 1) {
			newBoard[currentBlock.row + rIdx][currentBlock.col + cIdx] =
			currentBlock.type;
		}
		});
	});
	return newBoard;
	});
};

const clearLines = () => {
	setBoard((prev) => {
	const newBoard = prev.filter((row) => row.some((cell) => cell === null));
	const clearedLines = ROWS - newBoard.length;
	setScore((prev) => prev + clearedLines * 100);
	if (clearedLines > 0) {
		setLevel((prev) => prev + clearedLines);
		setIntervalTime((prev) => Math.max(100, prev - 50 * clearedLines));
	}
	const emptyRows = Array.from({ length: clearedLines }, () =>
		Array(COLS).fill(null)
	);
	return [...emptyRows, ...newBoard];
	});
};

const moveBlock = (rowOffset: number, colOffset: number, rotate = false) => {
	const newPos = {
	row: currentBlock.row + rowOffset,
	col: currentBlock.col + colOffset,
	};
	const newShape = rotate
	? rotateBlock(currentBlock.shape)
	: currentBlock.shape;
	if (!checkCollision(newShape, newPos)) {
	setCurrentBlock({ ...currentBlock, ...newPos, shape: newShape });
	} else if (rowOffset === 1) {
	fixBlockToBoard();
	clearLines();
	spawnNewBlock();
	}
};

const spawnNewBlock = () => {
	const newBlock = nextBlock;
	setNextBlock(getRandomBlock());
	if (checkCollision(newBlock.shape, { row: 0, col: 3 })) {
	setIsGameOver(true);
	} else {
	setCurrentBlock({ ...newBlock, row: 0, col: 3 });
	}
};

useEffect(() => {
	const interval = setInterval(() => {
	moveBlock(1, 0);
	}, intervalTime);
	return () => clearInterval(interval);
}, [intervalTime, currentBlock]);

useEffect(() => {
	const handleKeyDown = (e: KeyboardEvent) => {
	if (isGameOver) return;
	if (e.key === "ArrowLeft") moveBlock(0, -1);
	if (e.key === "ArrowRight") moveBlock(0, 1);
	if (e.key === "ArrowDown") moveBlock(1, 0);
	if (e.key === "ArrowUp") moveBlock(0, 0, true);
	};
	window.addEventListener("keydown", handleKeyDown);
	return () => window.removeEventListener("keydown", handleKeyDown);
}, [isGameOver]);

return (
	<div style={{ textAlign: "center" }}>
		<h1>Tetris</h1>
		<div
			style={{
			display: "grid",
			gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)`,
			gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`,
			gap: "1px",
			border: "2px solid black",
			}}
		>
			{board.map((row, rowIndex) =>
			row.map((cell, colIndex) => (
				<div
					key={`${rowIndex}-${colIndex}`}
					style={{
						width: `${BLOCK_SIZE}px`,
						height: `${BLOCK_SIZE}px`,
						backgroundColor: getColorForBlockType(cell),
						border: "1px solid gray",
					}}
				></div>
				))
			)}
		</div>
		<div style={{ marginTop: "20px" }}>
			<p>Score: {score}</p>
			<p>Level: {level}</p>
			{isGameOver && <h2>Game Over</h2>}
		</div>
		<div style={{ marginTop: "20px" }}>
			<h3>Next Block:</h3>
			<div
				style={{
					display: "grid",
					gridTemplateRows: `repeat(${nextBlock.shape.length}, ${BLOCK_SIZE}px)`,
					gridTemplateColumns: `repeat(${nextBlock.shape[0].length}, ${BLOCK_SIZE}px)`,
					gap: "1px",
				}}
			>
			{nextBlock.shape.map((row, rowIndex) =>
				row.map((cell, colIndex) => (
				<div
					key={`${rowIndex}-${colIndex}`}
					style={{
					width: `${BLOCK_SIZE}px`,
					height: `${BLOCK_SIZE}px`,
					backgroundColor: cell
						? getColorForBlockType(nextBlock.type)
						: "white",
					border: "1px solid gray",
					}}
				></div>
				))
			)}
			</div>
		  </div>
		</div>
	);
};

export default Main;
