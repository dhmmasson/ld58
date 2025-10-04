class Button {
  constructor(x, y, w, h, label, level) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = level.numberOfColors - 1;
    this.label = level.id;
    this.level = level;
  }

  draw() {
    fill(colorPalette[this.color]);
    stroke(255);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 10);
    fill(255);
    noStroke();
    textSize(24);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  mousePressed() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      Game.currentLevel = this.level;
      Game.changeMode(GameState.PLAY);
    }
  }
}

const buttons = levels.map((level, index) => {
  let cols = 4;
  let rows = Math.ceil(levels.length / cols);
  let boxSize = 64;
  let col = index % cols;
  let row = Math.floor(index / cols);
  let x = 50 + col * boxSize;
  let y = 100 + row * boxSize;
  return new Button(x, y, boxSize - 10, boxSize - 10, `Level ${index}`, level);
});

const MenuHandler = {
  enter: function () {
    console.log("Enter Menu");
  },
  draw: function () {
    background(50, 100, 150);
    // Level Selection (levels from levels.js)
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(255);
    text("Select Level", width / 2, 50);
    textSize(24);
    buttons.forEach((button) => button.draw());

    textSize(16);
    text("Click to Start", width / 2, height - 50);
  },
  mousePressed: function () {
    buttons.forEach((button) => button.mousePressed());
  },
};
Game.handlers.menu = MenuHandler;
