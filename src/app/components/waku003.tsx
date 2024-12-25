function drawBox(width: number, height: number): void {
    if (width < 2 || height < 2) {
      console.log("Width and height must be at least 2 to form a box.");
      return;
    }
  
    // Unicode box-drawing characters
    const topLeft = "┌"; // ┌ ┌
    const topRight = "┐"; // ┐ ┐
    const bottomLeft = "└"; // └ └
    const bottomRight = "┘"; // ┘ ┘
    const horizontal = "─"; // ─ ─
    const vertical = "│"; // │ │
  
    // Top border
    let topBorder = topLeft + horizontal.repeat(width - 2) + topRight;
    console.log(topBorder);
  
    // Middle section
    for (let i = 0; i < height - 2; i++) {
      let middleLine = vertical + " ".repeat(width - 2) + vertical;
      console.log(middleLine);
    }
  
    // Bottom border
    let bottomBorder = bottomLeft + horizontal.repeat(width - 2) + bottomRight;
    console.log(bottomBorder);
  }


  // Example usage
  const boxWidth = 10;
  const boxHeight = 5;
  drawBox(boxWidth, boxHeight);


  
  
  export default drawBox