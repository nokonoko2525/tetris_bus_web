"use client";

export default function Main() {
	return (
	<div>
		<h1>Tetris</h1>
			<div
				style={{
				display: "grid",
				gridTemplateRows: "repeat(20, 20px)",
				gridTemplateColumns: "repeat(10, 20px)",
				border: "2px solid black",
				}}
			>
				{/* ここにブロックを描画 */}
			</div>
	</div>
	);
}