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
  createCanvas(2 * 640, 640).parent(canvasElement);
  // resize it to fit the div
  windowResized();
  textAlign(CENTER, CENTER);

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
      (this.width - 32) / (this.cols + 1),
      (this.height - 32) / (this.rows + 1)
    );
    this.cellSize = floor(this.cellSize / 4) * 4; // round to multiple of 8

    // Center the grid
    this.offsetX = (this.width - this.cols * this.cellSize) / 2;
    this.offsetY = (this.height - this.rows * this.cellSize) / 2;
    // Update bounding boxes of all cells
    this.cellElements.forEach((cell) => cell.updateBoundingBox(this));
  },
  computeScores: function () {
    this.rowScores = [];
    this.colScores = [];
    for (let r = 0; r < this.rows; r++) {
      this.rowScores.push(computeScoreRow(this, this.values, r));
    }
    for (let c = 0; c < this.cols; c++) {
      this.colScores.push(computeScoreCol(this, this.values, c));
    }
    this.totalScore = 0;
    this.rowScores.forEach((row) => {
      row.forEach((pair) => {
        this.totalScore += pair.count == 1 ? 1 : 0;
      });
    });
    this.colScores.forEach((col) => {
      col.forEach((pair) => {
        this.totalScore += pair.count == 1 ? 1 : 0;
      });
    });
  },
  rowScores: [],
  colScores: [],
  totalScore: 0,
  values: [],
};

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

function generateScorePairs() {
  let n = gridInfo.numberOfColors;
  let pairs = Array(n)
    .fill(0)
    .map((_, i) =>
      Array(n)
        .fill(0)
        .map((_, j) => ({ i: i, j: j, key: `${i}${j}`, count: 0 }))
    );
  return pairs;
}
function computeScoreRow(gridInfo, values, row) {
  let pairs = generateScorePairs();
  for (let col = 0; col < gridInfo.cols; col++) {
    let current = values[row][col].color;
    let next = values[row][(col + 1) % gridInfo.cols].color;
    if (current >= 0 && next >= 0) {
      pairs[current][next].count++;
    }
  }
  return pairs.flat();
}
function computeScoreCol(gridInfo, values, col) {
  let pairs = generateScorePairs();
  for (let row = 0; row < gridInfo.rows; row++) {
    let current = values[row][col].color;
    let next = values[(row + 1) % gridInfo.rows][col].color;
    if (current >= 0 && next >= 0) {
      pairs[current][next].count++;
    }
  }
  return pairs.flat();
}

function drawGrid(cells) {
  // Clip area to the grid
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
  // Draw the cells
  cells.forEach((cell) => cell.draw());

  // Draw the grid border
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
}

function drawScores(gridInfo) {
  // At the end of the row draw the score pairs
  gridInfo.computeScores();
  stroke(0);
  strokeWeight(1);
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(16);
  // Draw the score pairs
  if (gridInfo.direction != "vertical") {
    gridInfo.rowScores.forEach((row, i) => {
      let x =
        gridInfo.offsetX +
        gridInfo.cols * gridInfo.cellSize +
        gridInfo.cellSize / 2 +
        10;
      let y = gridInfo.offsetY + (i + 0.5) * gridInfo.cellSize;
      let score = row.reduce((acc, pair) => acc + (pair.count == 1 ? 1 : 0), 0);

      text(score, x, y);
    });
  }
  if (gridInfo.direction != "horizontal") {
    gridInfo.colScores.forEach((col, i) => {
      let x = gridInfo.offsetX + (i + 0.5) * gridInfo.cellSize;
      let y =
        gridInfo.offsetY +
        gridInfo.rows * gridInfo.cellSize +
        gridInfo.cellSize / 2 +
        10;
      let score = col.reduce((acc, pair) => acc + (pair.count == 1 ? 1 : 0), 0);
      text(score, x, y);
    });
  }
}

const PlayHandler = {
  cells: [],
  selectedCell: null,
  hoveredCell: null,
  enter: function () {
    console.log("Enter Play");

    let currentLevel = Game.currentLevel ?? levels[5];

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
    let i = 0;
    for (let y = 0; y < gridInfo.rows; y++) {
      values.push([]);
      for (let x = 0; x < gridInfo.cols; x++) {
        values[y].push({
          color:
            currentLevel.values[i++] ??
            floor(random(0, gridInfo.numberOfColors)),
        });
      }
    }
    gridInfo.values = values;

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
    drawGrid(this.cells);

    drawScores(gridInfo);

    // Draw selected cell on top
    this.hoveredCell?.draw();
    this.selectedCell?.draw();
    colorPicker(this.selectedCell);
  },
  mousePressed: function () {
    this.cells.forEach((cell) => {
      if (cell.fixed) return;
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
      gridInfo.computeScores();
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
