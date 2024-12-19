"use client";
import React, { useState, useEffect } from "react";

export default function Main() {
	const [blockPosition, setBlockPosition] = useState({ row: 0, col: 5 }); // ブロックの初期位置
	const [isGameRunning, setIsGameRunning] = useState(true); // ゲームの実行状態
  
	// 矢印キーによるブロック移動
	const handleKeyDown = (e: KeyboardEvent) => {
	  setBlockPosition((prev) => {
		let newRow = prev.row;
		let newCol = prev.col;
  
		if (e.key === "ArrowLeft") newCol = Math.max(0, prev.col - 1); // 左移動
		if (e.key === "ArrowRight") newCol = Math.min(9, prev.col + 1); // 右移動
		if (e.key === "ArrowDown") newRow = Math.min(19, prev.row + 1); // 下移動
  
		return { row: newRow, col: newCol };
	  });
	};
  
	// 自然落下の処理
	useEffect(() => {
	  if (!isGameRunning) return;
  
	  const interval = setInterval(() => {
		setBlockPosition((prev) => {
		  const newRow = Math.min(19, prev.row + 1); // 下端に到達するまで移動
		  return { ...prev, row: newRow };
		});
	  }, 500); // 500ミリ秒ごとに1マス下に移動
  
	  // クリーンアップ処理
	  return () => clearInterval(interval);
	}, [isGameRunning]);
  
	// キー入力イベントリスナー
	useEffect(() => {
	  window.addEventListener("keydown", handleKeyDown);
	  return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
  
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
		  {Array.from({ length: 20 }).map((_, row) =>
			Array.from({ length: 10 }).map((_, col) => (
			  <div
				key={`${row}-${col}`}
				style={{
				  width: "20px",
				  height: "20px",
				  backgroundColor: row === blockPosition.row && col === blockPosition.col ? "blue" : "white",
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