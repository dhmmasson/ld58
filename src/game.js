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

const PlayHandler = {
  cells: [],
  gridInfo: {
    rows: 1,
    cols: 1,
    cellSize: 32,
    gap: 2,
    offsetX: 0,
    offsetY: 0,
  },
  enter: function () {
    console.log("Enter Play");
    this.cells = [];
    this.gridInfo.offsetX =
      (width -
        (this.gridInfo.cols * this.gridInfo.cellSize +
          (this.gridInfo.cols - 1) * this.gridInfo.gap)) /
      2;
    this.gridInfo.offsetY =
      (height -
        (this.gridInfo.rows * this.gridInfo.cellSize +
          (this.gridInfo.rows - 1) * this.gridInfo.gap)) /
      2;

    this.cells.push(new Cell(0, 0));
    this.cells.forEach((cell) => cell.updateBoundingBox(this.gridInfo));
  },
  draw: function () {
    background(100, 150, 50);
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
  console.log(size.width, size.height, minSize);
  resizeCanvas(minSize, minSize);
  // Force Menu refresh
}
