let colorPalette = ["#f72585", "#720026", "#3a0ca3", "#4361ee"];
class Cell {
  x; // position on the grid
  y; // position on the grid
  color; // index in the palette
  boundingBox; // for mouse interaction
  constructor(x, y, color = 0) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  updateBoundingBox(gridInfo) {
    this.boundingBox = {
      x: this.x * (gridInfo.cellSize + gridInfo.gap) + gridInfo.offsetX,
      y: this.y * (gridInfo.cellSize + gridInfo.gap) + gridInfo.offsetY,
      width: gridInfo.cellSize,
      height: gridInfo.cellSize,
    };
  }

  draw() {
    if (this.mouseOver(mouseX, mouseY)) {
      stroke(255, 204, 0);
      strokeWeight(4);
    } else {
      strokeWeight(1);
    }
    stroke(0);
    fill(colorPalette[this.color]);
    rect(
      this.boundingBox.x,
      this.boundingBox.y,
      this.boundingBox.width,
      this.boundingBox.height
    );
  }

  mouseOver(mx, my) {
    return (
      mx >= this.boundingBox.x &&
      mx <= this.boundingBox.x + this.boundingBox.width &&
      my >= this.boundingBox.y &&
      my <= this.boundingBox.y + this.boundingBox.height
    );
  }
}
