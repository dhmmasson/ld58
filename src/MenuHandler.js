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
