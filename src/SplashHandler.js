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
    textSize(50);

    fill("#ee5533");
    textAlign(RIGHT, CENTER);
    text("LD", width / 2, height / 2);
    fill("#f79122");
    textAlign(LEFT, CENTER);
    text("58", width / 2, height / 2);
    fill(255);
    textAlign(CENTER, CENTER);

    text("Tiles Collector", width / 2, height / 2 + 50);

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
Game.changeMode(GameState.SPLASH);
