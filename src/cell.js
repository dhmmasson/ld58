let colorPalette = ["#f79256", "#fbd1a2", "#7dcfb6", "#00b2ca"];

class Cell {
  x; // position on the grid
  y; // position on the grid

  boundingBox; // for mouse interaction
  hovered = false;
  selected = false;
  fixed = false;
  value = null;
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    if (isNaN(this.value.color)) {
      this.value.color = -1;
    }
  }

  updateBoundingBox(gridInfo) {
    this.boundingBox = {
      x: this.x * gridInfo.cellSize + gridInfo.offsetX,
      y: this.y * gridInfo.cellSize + gridInfo.offsetY,
      width: gridInfo.cellSize,
      height: gridInfo.cellSize,
      cx: 0,
      cy: 0,
    };
    this.boundingBox.cx = this.boundingBox.x + this.boundingBox.width / 2;
    this.boundingBox.cy = this.boundingBox.y + this.boundingBox.height / 2;
  }

  draw() {
    if (this.hovered) {
      stroke(255, 204, 0);
      strokeWeight(4);
    } else {
      strokeWeight(2);
    }
    stroke(this.fixed ? 150 : 0);
    if (this.value.color < 0) {
      noFill();
    } else {
      fill(colorPalette[this.value.color]);
    }
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

function updateColor(cell) {
  if (cell) {
    let dx = mouseX - cell.boundingBox.cx;
    let dy = mouseY - cell.boundingBox.cy;
    // if the distance is too small, do not change color
    let distance = sqrt(dx * dx + dy * dy);

    if (distance < gridInfo.cellSize / 4 || distance > 100) {
      return cell.value.color;
    }
    let angle = atan2(dy, dx);
    if (angle < 0) {
      angle += TWO_PI;
    }
    // Determine the direction based on the angle
    let direction =
      floor(angle / ((2 * PI) / gridInfo.numberOfColors)) %
      gridInfo.numberOfColors;
    return direction;
  }
  return cell.value.color;
}

function colorPicker(selectedCell) {
  // Draw color picker around selected cell
  if (selectedCell) {
    ellipseMode(CENTER);
    strokeWeight(2);
    ellipse(
      selectedCell.boundingBox.cx,
      selectedCell.boundingBox.cy,
      min(64, gridInfo.cellSize * 2),
      min(64, gridInfo.cellSize * 2)
    );
    strokeWeight(1);
    // noStroke();
    fill(255, 204, 0, 150);
    // Draw 4 arcs (sectors of 90 degrees) around the selected cell
    let cx = selectedCell.boundingBox.cx;
    let cy = selectedCell.boundingBox.cy;
    let r = gridInfo.cellSize;
    let angles = Array.from(
      { length: gridInfo.numberOfColors + 1 },
      (_, i) => (i * TWO_PI) / gridInfo.numberOfColors
    );
    for (let i = 0; i < gridInfo.numberOfColors; i++) {
      fill(colorPalette[i]);
      arc(cx, cy, r * 2, r * 2, angles[i], angles[i + 1], PIE);
    }
    fill(colorPalette[updateColor(selectedCell)]);
    strokeWeight(2);
    stroke(colorPalette[updateColor(selectedCell)]);
    ellipse(
      selectedCell.boundingBox.cx,
      selectedCell.boundingBox.cy,
      gridInfo.cellSize * 0.71,
      gridInfo.cellSize * 0.71
    );
  }
}
