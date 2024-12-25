"use client";
import React, { useState, useEffect } from "react";

export default function ScoreIncrementer() {
  const [score, setScore] = useState(0); // スコアの初期値
  const [isGameRunning, setIsGameRunning] = useState(true); // ゲームの実行状態

  // スコアを増加させる処理
  const startScoreIncrease = () => {
    const interval = setInterval(() => {
      setScore((prev) => prev + 10); // 1秒ごとにスコアを増加
    }, 1000);

    return interval;
  };

  useEffect(() => {
    if (!isGameRunning) return;

    const interval = startScoreIncrease();

    // クリーンアップ処理
    return () => clearInterval(interval);
  }, [isGameRunning]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Score Tracker</h1>
      <p>Score: {score}</p>
      <button onClick={() => setIsGameRunning((prev) => !prev)}>
        {isGameRunning ? "Pause" : "Resume"}
      </button>
    </div>
  );
}
