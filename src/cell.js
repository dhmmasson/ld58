let colorPalette = ["#f79256", "#fbd1a2", "#7dcfb6", "#00b2ca"];

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
      cx: 0,
      cy: 0,
    };
    this.boundingBox.cx = this.boundingBox.x + this.boundingBox.width / 2;
    this.boundingBox.cy = this.boundingBox.y + this.boundingBox.height / 2;
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
