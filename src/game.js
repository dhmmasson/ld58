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

  // create a biiiiig canvas to start with
  createCanvas(2 * 640, 480).parent(canvasElement);
  // resize it to fit the div
  windowResized();
  textAlign(CENTER, CENTER);

  background(0);
  Game.changeMode(GameState.SPLASH);
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

function keyPressed() {
  // key ESC to return to menu
  console.log(keyCode);
  if (keyCode === 27) {
    Game.changeMode(GameState.MENU);
  }
}

const gridInfo = {
  width: 720,
  height: 720,
  direction: "horizontal", // or vertical or both
  rows: 1,
  cols: 16,
  numberOfColors: 3,
  cellSize: 32,

  offsetX: 0,
  offsetY: 0,
  cellElements: [],
  resize: function () {
    this.width = min(720, width);
    this.height = min(720, height);

    // Compute the cell size to fit the grid in the canvas
    this.cellSize = min(
      this.width / (this.cols + 1),
      this.height / (this.rows + 1)
    );
    this.cellSize = floor(this.cellSize / 4) * 4; // round to multiple of 8

    // Center the grid
    this.offsetX = (this.width - this.cols * this.cellSize) / 2;
    this.offsetY = (this.height - this.rows * this.cellSize) / 2;
    // Update bounding boxes of all cells
    this.cellElements.forEach((cell) => cell.updateBoundingBox(this));
  },
};

const PlayHandler = {
  cells: [],
  selectedCell: null,
  hoveredCell: null,
  enter: function () {
    console.log("Enter Play");

    let currentLevel = Game.currentLevel;

    this.cells = [];
    gridInfo.numberOfColors = currentLevel.numberOfColors;
    let length = currentLevel.length;
    gridInfo.direction = currentLevel.direction; // "horizontal", "vertical", "both", "1D"
    if (gridInfo.direction == "1D") {
      if (width < 360) {
        gridInfo.direction = "vertical";
        gridInfo.rows = length;
        gridInfo.cols = 1;
      } else {
        gridInfo.direction = "horizontal";
        gridInfo.rows = 1;
        gridInfo.cols = length;
      }
    } else {
      gridInfo.direction = "both";
      gridInfo.rows = floor(length);
      gridInfo.cols = ceil(length);
    }

    gridInfo.resize();
    gridInfo.cellElements = this.cells;

    let values = [];
    for (let y = 0; y < gridInfo.rows; y++) {
      values.push([]);
      for (let x = 0; x < gridInfo.cols; x++) {
        values[y].push({
          color: floor(random(0, gridInfo.numberOfColors)),
        });
      }
    }

    // Create cells, add an extra row/col that is identical to the first/last one

    for (
      let y = gridInfo.direction != "horizontal" ? -1 : 0;
      y < gridInfo.rows + (gridInfo.direction != "horizontal" ? 1 : 0);
      y++
    ) {
      for (
        let x = gridInfo.direction != "vertical" ? -1 : 0;
        x < gridInfo.cols + (gridInfo.direction != "vertical" ? 1 : 0);
        x++
      ) {
        let sx = (gridInfo.cols + x) % gridInfo.cols;
        let sy = (gridInfo.rows + y) % gridInfo.rows;
        let value = values[sy][sx];
        this.cells.push(new Cell(x, y, value));
        if (x != sx || y != sy) {
          this.cells[this.cells.length - 1].fixed = true;
        }
      }
    }

    this.cells.forEach((cell) => cell.updateBoundingBox(gridInfo));
  },
  draw: function () {
    background(255);
    // Draw Grid
    push();
    beginClip();
    rectMode(CORNER);
    rect(
      gridInfo.offsetX - gridInfo.cellSize / 2,
      gridInfo.offsetY - gridInfo.cellSize / 2,
      gridInfo.cols * gridInfo.cellSize + gridInfo.cellSize,
      gridInfo.rows * gridInfo.cellSize + gridInfo.cellSize,
      gridInfo.cellSize / 2
    );
    endClip();

    this.cells.forEach((cell) => cell.draw());

    rectMode(CORNER);
    noFill();
    stroke(0);
    strokeWeight(3);
    rect(
      gridInfo.offsetX,
      gridInfo.offsetY,
      gridInfo.cols * gridInfo.cellSize,
      gridInfo.rows * gridInfo.cellSize
    );
    pop();
    // Draw selected cell on top
    if (this.hoveredCell) {
      this.hoveredCell.draw();
    }
    if (this.selectedCell) {
      ellipseMode(CENTER);
      strokeWeight(2);
      ellipse(
        this.selectedCell.boundingBox.cx,
        this.selectedCell.boundingBox.cy,
        gridInfo.cellSize * 2,
        gridInfo.cellSize * 2
      );
      strokeWeight(1);
      // noStroke();
      fill(255, 204, 0, 150);
      // Draw 4 arcs (sectors of 90 degrees) around the selected cell
      let cx = this.selectedCell.boundingBox.cx;
      let cy = this.selectedCell.boundingBox.cy;
      let r = gridInfo.cellSize;
      let angles = Array.from(
        { length: gridInfo.numberOfColors + 1 },
        (_, i) => (i * TWO_PI) / gridInfo.numberOfColors
      );
      for (let i = 0; i < gridInfo.numberOfColors; i++) {
        fill(colorPalette[i]);
        arc(cx, cy, r * 2, r * 2, angles[i], angles[i + 1], PIE);
      }
      fill(colorPalette[updateColor(this.selectedCell)]);
      strokeWeight(2);
      stroke(colorPalette[updateColor(this.selectedCell)]);
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
      // if (cell.fixed) return;
      if (cell.mouseOver(mouseX, mouseY)) {
        this.selectedCell = cell;
        cell.selected = true;
      }
    });
  },
  mouseOver: function () {
    if (!this.selectedCell) {
      this.hoveredCell = null;

      this.cells.forEach((cell) => {
        if (cell.fixed) return;
        cell.hovered = false;
        if (cell.mouseOver(mouseX, mouseY)) {
          this.hoveredCell = cell;
          cell.hovered = true;
        }
      });
    }
  },
  mouseReleased: function () {
    // Compute the distance from the center of the selected cell to the mouse position
    if (this.selectedCell) {
      this.selectedCell.value.color = updateColor(this.selectedCell);
      this.selectedCell.selected = false;
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
