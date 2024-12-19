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
  