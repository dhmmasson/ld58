const GameState = {
  SPLASH: "splash",
  MENU: "menu",
  PLAY: "playing",
};

const Game = {
  state: null,
  handlers: {
    splash: null,
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
  createCanvas(10000, 10000).parent(canvasElement);
  // resize it to fit the div
  windowResized();
  textAlign(CENTER, CENTER);
  console.log(width, height);
  background(0);
  Game.changeMode(GameState.SPLASH);
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
};
Game.handlers.menu = MenuHandler;

//Resize canvas to fill the div
function windowResized() {
  const size = select("#canvasContainer").size();

  // Square Board
  let minSize = min(size.width, size.height);
  resizeCanvas(minSize, minSize);
  // Force Menu refresh
}
