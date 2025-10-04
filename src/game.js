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

function mousePressed() {
  if (Game.currentHandler && Game.currentHandler.mousePressed) {
    Game.currentHandler.mousePressed();
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

const PlayHandler = {
  cells: [],

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
  },
  mousePressed: function () {
    console.log("Play mousePressed");
    // Game.changeMode(GameState.MENU);
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
