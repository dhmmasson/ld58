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
  console.clear();
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

const SplashHandler = {
  opacity: 0,
  enter: function () {
    this.opacity = 255;
    console.log("Enter Splash");
  },
  draw: function () {
    this.opacity = lerp(this.opacity, 0, 0.01);
    background(0);
    fill(255);
    noStroke();
    textSize(100);

    fill("#ee5533");
    textAlign(RIGHT, CENTER);
    text("LD", width / 2, height / 2);
    fill("#f79122");
    textAlign(LEFT, CENTER);
    text("58", width / 2, height / 2);
    fill(255);
    textAlign(CENTER, CENTER);
    text("The Game", width / 2, height / 2 + 100);
    textSize(20);
    text("Made in 48 hours", width / 2, height / 2 + 160);
    text("by Dimitri Masson", width / 2, height / 2 + 180);
    text("Click to start", width / 2, height / 2 + 200);

    fill(0, this.opacity);
    rect(0, 0, width, height);
  },
  mousePressed: function () {
    console.log("Splash mousePressed");
    Game.changeMode(GameState.MENU);
  },
};
Game.handlers.splash = SplashHandler;

const MenuHandler = {
  enter: function () {
    console.log("Enter Menu");
  },
  draw: function () {
    background(50, 100, 150);
  },
  mousePressed: function () {
    console.log("Menu mousePressed");
    Game.changeMode(GameState.PLAY);
  },
};
Game.handlers.menu = MenuHandler;

colorPalette = ["#f72585", "#720026", "#3a0ca3", "#4361ee"];

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
    stroke(0);

    fill(colorPalette[this.color]);
    rect(
      this.boundingBox.x,
      this.boundingBox.y,
      this.boundingBox.width,
      this.boundingBox.height
    );
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
