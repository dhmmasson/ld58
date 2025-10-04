const GameState = {
  SPLASH: "splash",
  MENU: "menu",
  PLAY: "play",
};

const Game = {
  state: null,
  handlers: {
    splash: null,
    menu: null,
    play: null,
  },
  currentHandler: null,
  changeMode: function (newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.currentHandler = this.handlers[this.state];
      if (this.currentHandler && this.currentHandler.enter) {
        this.currentHandler.enter();
      }
    }
  },
};

function setup() {
  // console.clear();
  const canvasElement = document.getElementById("canvasContainer");
  console.log(canvasElement);
  // create a biiiiig canvas to start with
  createCanvas(2 * 640, 480).parent(canvasElement);
  // resize it to fit the div
  windowResized();
  textAlign(CENTER, CENTER);
  console.log(width, height);
  background(0);
  Game.changeMode(GameState.PLAY);
}

function draw() {
  if (Game.currentHandler) {
    Game.currentHandler.draw();
  }
}

// Event forwarding
function mousePressed() {
  if (Game.currentHandler && Game.currentHandler.mousePressed) {
    Game.currentHandler.mousePressed();
  }
}

function mouseReleased() {
  if (Game.currentHandler && Game.currentHandler.mouseReleased) {
    Game.currentHandler.mouseReleased();
  }
}

function mouseMoved() {
  if (Game.currentHandler && Game.currentHandler.mouseOver) {
    Game.currentHandler.mouseOver();
  }
}

const gridInfo = {
  rows: 1,
  cols: 16,
  cellSize: 32,
  gap: 8,
  padding: 10,
  offsetX: 0,
  offsetY: 0,
  cellElements: [],
  resize: function () {
    // Compute the cell size to fit the grid in the canvas
    this.cellSize = min(
      (width - 2 * this.padding - (this.cols - 1) * this.gap) / this.cols,
      (height - 2 * this.padding - (this.rows - 1) * this.gap) / this.rows
    );
    this.cellSize = floor(this.cellSize / 8) * 8; // round to multiple of 8
    this.gap = 0;
    // Center the grid
    this.offsetX =
      (width - (this.cols * this.cellSize + (this.cols - 1) * this.gap)) / 2;
    this.offsetY =
      (height - (this.rows * this.cellSize + (this.rows - 1) * this.gap)) / 2;
    // Update bounding boxes of all cells
    this.cellElements.forEach((cell) => cell.updateBoundingBox(this));
  },
};

function updateColor(cell) {
  if (cell) {
    let dx = mouseX - cell.boundingBox.cx;
    let dy = mouseY - cell.boundingBox.cy;
    // if the distance is too small, do not change color
    let distance = sqrt(dx * dx + dy * dy);
    console.log(distance, gridInfo.cellSize);
    if (distance < gridInfo.cellSize / 4 || distance > gridInfo.cellSize) {
      return cell.color;
    }
    let angle = atan2(dy, dx);
    if (angle < 0) {
      angle += TWO_PI;
    }
    // Determine the direction based on the angle
    let direction = floor(angle / (PI / 2)) % 4;
    return direction;
  }
  return cell.color;
}

const PlayHandler = {
  cells: [],
  selectedCell: null,
  hoveredCell: null,
  enter: function () {
    console.log("Enter Play");
    this.cells = [];
    gridInfo.rows = 1;
    gridInfo.cols = 16;
    gridInfo.resize();
    gridInfo.cellElements = this.cells;

    for (let y = 0; y < gridInfo.rows; y++) {
      for (let x = 0; x < gridInfo.cols; x++) {
        this.cells.push(new Cell(x, y, floor(random(0, 4))));
      }
    }

    this.cells.forEach((cell) => cell.updateBoundingBox(gridInfo));
  },
  draw: function () {
    background(255);
    // Draw Grid
    this.cells.forEach((cell) => cell.draw());

    // Draw selected cell on top
    if (this.hoveredCell) {
      this.hoveredCell.draw();
    }
    if (this.selectedCell) {
      ellipseMode(CENTER);
      ellipse(
        this.selectedCell.boundingBox.cx,
        this.selectedCell.boundingBox.cy,
        gridInfo.cellSize * 2,
        gridInfo.cellSize * 2
      );
      noStroke();
      fill(255, 204, 0, 150);
      // Draw 4 arcs (sectors of 90 degrees) around the selected cell
      let cx = this.selectedCell.boundingBox.cx;
      let cy = this.selectedCell.boundingBox.cy;
      let r = gridInfo.cellSize;
      let angles = [0, HALF_PI, PI, PI + HALF_PI];
      for (let i = 0; i < 4; i++) {
        fill(colorPalette[i]);
        arc(cx, cy, r * 2, r * 2, angles[i], angles[i] + HALF_PI, PIE);
      }
      fill(colorPalette[updateColor(this.selectedCell)]);
      ellipse(
        this.selectedCell.boundingBox.cx,
        this.selectedCell.boundingBox.cy,
        gridInfo.cellSize * 0.71,
        gridInfo.cellSize * 0.71
      );
    }
  },
  mousePressed: function () {
    this.cells.forEach((cell) => {
      if (cell.mouseOver(mouseX, mouseY)) {
        this.selectedCell = cell;
      }
    });
  },
  mouseOver: function () {
    this.hoveredCell = null;
    this.cells.forEach((cell) => {
      if (cell.mouseOver(mouseX, mouseY)) {
        this.hoveredCell = cell;
      }
    });
  },
  mouseReleased: function () {
    // Compute the distance from the center of the selected cell to the mouse position
    if (this.selectedCell) {
      this.hoveredCell.color = updateColor(this.selectedCell);
    }
    this.selectedCell = null;
  },
};
Game.handlers.play = PlayHandler;

//Resize canvas to fill the div
function windowResized() {
  const size = select("#canvasContainer").size();

  // Square Board
  let minSize = min(size.width, size.height);

  resizeCanvas(size.width, height);
  gridInfo.resize();
  // Force Menu refresh
}
