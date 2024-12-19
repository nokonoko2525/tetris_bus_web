// Tetris Block and Logic in TypeScript

// Define Tetris block types as 2D arrays
const TETROMINOES = {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ] as const,
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ] as const,
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ] as const,
    O: [
      [1, 1],
      [1, 1],
    ] as const,
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ] as const,
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ] as const,
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ] as const,
  } as const;
  
  type Tetromino = keyof typeof TETROMINOES;
  
  type Position = {
    x: number;
    y: number;
  };
  
  class TetrisBlock {
    shape: readonly (readonly number[])[];
    position: Position;
  
    constructor(type: Tetromino, startX: number = 0, startY: number = 0) {
      this.shape = TETROMINOES[type];
      this.position = { x: startX, y: startY };
    }
  
    // Rotate the block clockwise
    rotate() {
      const N = this.shape.length;
      const rotatedShape: number[][] = [];
  
      for (let x = 0; x < N; x++) {
        rotatedShape[x] = [];
        for (let y = 0; y < N; y++) {
          rotatedShape[x][y] = this.shape[N - y - 1][x];
        }
      }
  
      this.shape = rotatedShape;
    }
  
    // Move the block
    move(deltaX: number, deltaY: number) {
      this.position.x += deltaX;
      this.position.y += deltaY;
    }
  
    // Display the block as a string for debugging
    display(): void {
      console.log(`Position: (${this.position.x}, ${this.position.y})`);
      this.shape.forEach((row) => console.log(row.map((cell) => (cell ? "#" : " ")).join(" ")));
    }
  }
  
  // Score management
  class TetrisScore {
    private score: number;
    private linesCleared: number;
    private level: number;
  
    constructor() {
      this.score = 0;
      this.linesCleared = 0;
      this.level = 1;
    }
  
    // Update score based on the number of lines cleared
    update(lines: number): void {
      const pointsPerLine = [0, 100, 300, 500, 800];
      this.score += pointsPerLine[lines] * this.level;
      this.linesCleared += lines;
  
      // Increase level every 10 lines cleared
      if (Math.floor(this.linesCleared / 10) + 1 > this.level) {
        this.level = Math.floor(this.linesCleared / 10) + 1;
        console.log(`Level Up! Current Level: ${this.level}`);
      }
    }
  
    // Display the current score
    display(): void {
      console.log(`Score: ${this.score} | Lines Cleared: ${this.linesCleared} | Level: ${this.level}`);
    }
  }
  
  // Example usage
  const block = new TetrisBlock("T", 5, 0);
  const scoreManager = new TetrisScore();
  
  console.log("Initial Block:");
  block.display();
  scoreManager.display();
  
  console.log("\nAfter Clearing 2 Lines:");
  scoreManager.update(2);
  scoreManager.display();
  
  console.log("\nAfter Clearing 4 Lines:");
  scoreManager.update(4);
  scoreManager.display();
  
  console.log("\nAfter Clearing 1 Line:");
  scoreManager.update(1);
  scoreManager.display();
  