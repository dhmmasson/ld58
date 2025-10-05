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
    this.state = newState;
    this.currentHandler = this.handlers[this.state];
    if (this.currentHandler && this.currentHandler.enter) {
      this.currentHandler.enter();
    }
  },
};

function setup() {
  // console.clear();
  const canvasElement = document.getElementById("game");

  // create a biiiiig canvas to start with
  createCanvas(2 * 640, 640).parent(canvasElement);
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
  hintSpace: "right", // or bottom or none
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
    this.cellSize = min(this.cellSize, 64); // maximum size

    this.cellSize = floor(this.cellSize / 4) * 4; // round to multiple of 8

    // Center the grid
    this.offsetX = (this.width - this.cols * this.cellSize) / 2;
    this.offsetY = this.cellSize / 2 + 16;
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
    if (this.cols > 1) {
      this.rowScores.forEach((row) => {
        row.forEach((pair) => {
          this.totalScore += pair.count == 1 ? 1 : 0;
        });
      });
    }
    if (this.rows > 1) {
      this.colScores.forEach((col) => {
        col.forEach((pair) => {
          this.totalScore += pair.count == 1 ? 1 : 0;
        });
      });
    }
  },
  rowScores: [],
  colScores: [],
  totalScore: 0,
  values: [],
};

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

function computeScoreText(scores) {
  return scores.map((row, i) => {
    let x = gridInfo.cols * gridInfo.cellSize + gridInfo.cellSize / 2 + 10;
    let y = (i + 0.5) * gridInfo.cellSize;
    let score = row.reduce((acc, pair) => acc + (pair.count == 1 ? +1 : 0), 0);
    return { score, x, y };
  });
}

function markFrontier(scores, orientation = "horizontal") {
  // For each cell in the grid, look at the 4 neighbors (wrap around), look in the scores
  const values = gridInfo.values;
  const cols = gridInfo.cols;
  const rows = gridInfo.rows;
  noStroke();
  fill(0);
  let check = (scores, a, b) =>
    scores.find((p) => p.i == a && p.j == b)?.count != 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let current = values[r][c].color;
      let up = values[(r - 1 + rows) % rows][c].color;
      let down = values[(r + 1) % rows][c].color;
      let left = values[r][(c - 1 + cols) % cols].color;
      let right = values[r][(c + 1) % cols].color;

      let cx = gridInfo.offsetX + (c + 0.5) * gridInfo.cellSize;
      let cy = gridInfo.offsetY + (r + 0.5) * gridInfo.cellSize;

      if (orientation !== "horizontal") {
        // Vertical or both
        if (check(gridInfo.colScores[c], current, down)) {
          circle(cx, cy + gridInfo.cellSize / 2, 6);
        }
        if (check(gridInfo.colScores[c], up, current)) {
          circle(cx, cy - gridInfo.cellSize / 2, 6);
        }
      }
      if (orientation !== "vertical") {
        // Horizontal or both
        if (check(gridInfo.rowScores[r], current, right)) {
          circle(cx + gridInfo.cellSize / 2, cy, 6);
        }
        if (check(gridInfo.rowScores[r], left, current)) {
          circle(cx - gridInfo.cellSize / 2, cy, 6);
        }
      }
    }
  }
}

function drawScores(gridInfo) {
  // At the end of the row draw the score pairs
  gridInfo.computeScores();
  noStroke(0);
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(11);
  // Draw the score pairs
  if (gridInfo.direction != "vertical") {
    textAlign(LEFT, CENTER);
    computeScoreText(gridInfo.rowScores).forEach(({ score, x, y }) => {
      text(`${score}`, gridInfo.offsetX + x, gridInfo.offsetY + y);
    });
    markFrontier(gridInfo.colScores, gridInfo.direction);
  }
  if (gridInfo.direction != "horizontal") {
    textAlign(CENTER, CENTER);
    computeScoreText(gridInfo.colScores).forEach(({ score, x, y }) => {
      text(`${score}`, gridInfo.offsetX + y, gridInfo.offsetY + x);
    });
    markFrontier(gridInfo.colScores, gridInfo.direction);
  }
}

function drawHint() {
  // Draw a red rectangle if the
  if (gridInfo.hintSpace === "none") return;
  push();
  rectMode(CORNER);
  noFill();
  stroke(255, 0, 0);
  strokeWeight(4);
  let left = 0;
  let top = 0;
  if (gridInfo.hintSpace === "right") {
    left = gridInfo.offsetX + gridInfo.cols * gridInfo.cellSize + 64;
  } else if (gridInfo.hintSpace === "bottom") {
    top = gridInfo.offsetY + gridInfo.rows * gridInfo.cellSize + 64;
  }
  translate(left, top);

  // Draw text
  noStroke();
  fill(255, 0, 0);

  // Row collected tile pairs and missing pairs
  // Get the row of the highligted cell
  let highlightedRow = -1;
  let highlightedCol = -1;
  if (gridInfo.direction == "horizontal") {
    highlightedRow = 0;
  } else if (gridInfo.direction == "vertical") {
    highlightedCol = 0;
  } else if (PlayHandler.hoveredCell) {
    highlightedRow =
      (PlayHandler.hoveredCell.y + gridInfo.rows) % gridInfo.rows;
    highlightedCol =
      (PlayHandler.hoveredCell.x + gridInfo.cols) % gridInfo.cols;
  } else if (PlayHandler.selectedCell) {
    highlightedRow =
      (PlayHandler.selectedCell.y + gridInfo.rows) % gridInfo.rows;
    highlightedCol =
      (PlayHandler.selectedCell.x + gridInfo.cols) % gridInfo.cols;
  }

  if (highlightedCol >= 0 || highlightedRow >= 0) {
    const totalPairs = gridInfo.numberOfColors * gridInfo.numberOfColors;
    const margin = 4;
    const pairSize = min(
      48,
      (width - left - 32 - margin * (totalPairs + 1)) / totalPairs
    );
    const offsetY = 32;
    const y = 60;

    textAlign(LEFT, TOP);
    textSize(15);
    fill(0);
    if (gridInfo.direction != "vertical") {
      text(
        `Collected Pairs on Row ${highlightedRow + 1} : ${
          gridInfo.rowScores[highlightedRow].filter((pair) => pair.count == 1)
            .length
        }`,
        32,
        offsetY + 20
      );
      gridInfo.rowScores[highlightedRow].forEach((pair) =>
        drawDomino(pair, 32, offsetY + y, pairSize, margin)
      );
    }
    if (gridInfo.direction != "horizontal") {
      text(
        `Collected Pairs on Column ${highlightedCol + 1}: ${
          gridInfo.colScores[highlightedCol].filter((pair) => pair.count == 1)
            .length
        } `,
        32,
        offsetY + pairSize + margin * 2 + 15 + 20
      );
      gridInfo.colScores[highlightedCol].forEach((pair, index) =>
        drawDomino(
          pair,
          32,
          offsetY + y + pairSize + margin + 20,
          pairSize,
          margin,
          "vertical"
        )
      );
    }
  }
  // Draw the total score on top of the hint area
  textAlign(LEFT, TOP);
  textSize(20);
  fill(0);
  text(
    `Score: ${gridInfo.totalScore}/${
      gridInfo.rows * gridInfo.cols
    } collected pairs on the board `,
    32,
    32
  );

  pop();
}

function drawDomino(
  pair,
  offsetX,
  y,
  pairSize,
  margin,
  orientation = "horizontal"
) {
  push();
  // Draw the pair as a domino of two square with the right color
  let color1 = pair.i >= 0 ? colorPalette[pair.i] : color(100);
  let color2 = pair.j >= 0 ? colorPalette[pair.j] : color(100);

  const x =
    offsetX +
    margin +
    pairSize / 2 +
    (pairSize + margin) * (pair.i * gridInfo.numberOfColors + pair.j);

  // Draw the border

  push();
  {
    beginClip();
    {
      rectMode(CENTER);
      strokeWeight(2);
      rect(x, y, pairSize, pairSize, 2);
    }
    endClip();
    // Draw the two half squares inside
    stroke(100);
    strokeWeight(1);
    rectMode(CORNER);
    if (orientation === "vertical") {
      // Top half
      fill(color1);

      rect(x - pairSize / 2, y - pairSize / 2, pairSize, pairSize / 2);
      // Bottom half
      fill(color2);
      rect(x - pairSize / 2, y, pairSize, pairSize / 2);
    } else {
      // Left half
      fill(color1);
      rect(x - pairSize / 2, y - pairSize / 2, pairSize / 2, pairSize);
      // Right half
      fill(color2);
      rect(x, y - pairSize / 2, pairSize / 2, pairSize);
    }
  }
  pop();
  rectMode(CENTER);

  strokeWeight(1);
  if (pair.count > 0) {
    noFill();
    stroke(10, 10, 10);
  } else {
    fill(100, 100, 100, 100);
    stroke(200, 200, 100);
  }
  rect(x, y, pairSize, pairSize, 2);
  // Draw the count in the middle
  noStroke();
  fill(50, 50, 50, 150);
  circle(x, y - 1, 17);
  fill(255);

  textAlign(CENTER, CENTER);
  textSize(14);
  text(pair.count, x, y);
  // Draw the count in the middle
  pop();
}

const PlayHandler = {
  cells: [],
  selectedCell: null,
  hoveredCell: null,
  enter: function () {
    let currentLevel = Game.currentLevel ?? levels[5];
    Game.startTime = millis();

    if (currentLevel.info) {
      infoBox(
        currentLevel.info.title ?? "Info",
        currentLevel.info.text ?? "",
        currentLevel.info.image ?? null,
        currentLevel.info.closeOnClick ?? false
      );
    }

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
          color: currentLevel.values[i++] ?? -1, // -1 means empty, otherwise a color index
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
        if (value.color >= 0) {
          this.cells[this.cells.length - 1].fixed = true;
        }
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
    drawHint();
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
      if (Game.currentLevel.end?.check(gridInfo)) {
        Game.endTime = millis();
        console.log(
          "Level complete in ",
          (Game.endTime - Game.startTime) / 1000
        );
        if (Game.currentLevel.leaderboard == "fastest") {
          infoBox(
            "Level Complete!",
            `You completed the level in ${
              (Game.endTime - Game.startTime) / 1000
            } seconds!<br>
            Submit your score to the leaderboard!`,
            null,
            false,
            Game.currentLevel.end?.nextLevel ?? null
          );
        } else {
          infoBox(
            Game.currentLevel.end.info.title ?? "Info",
            Game.currentLevel.end.info.text ?? "",
            Game.currentLevel.end.info.image ?? null,
            Game.currentLevel.end.info.closeOnClick ?? false
          );
          if (Game.currentLevel.end?.nextLevel) {
            Game.currentLevel = Game.currentLevel.end.nextLevel;
          }
        }
      }
    }

    this.selectedCell = null;
  },
};
Game.handlers.play = PlayHandler;

//Resize canvas to fill the div
function windowResized() {
  const size = select("#game").size();

  // the board should be square 640 and we need space for scores.
  // on computer we can have a wide board, on mobile a tall one
  if (size.width > 720 + 200) {
    size.height = 720;
    size.width = size.width;
    gridInfo.hintSpace = "right";
  } else {
    size.width = size.width;
    size.height = 720 + 200;
    gridInfo.hintSpace = "bottom";
  }

  resizeCanvas(size.width, size.height);
  gridInfo.resize();
  // Force Menu refresh
}
