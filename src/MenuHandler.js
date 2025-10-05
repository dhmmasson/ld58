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

  mousePressed() {}
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
    openMenu();
  },
  draw: function () {
    background(255);
    // Level Selection (levels from levels.js)
    textAlign(CENTER, CENTER);

    fill(0);
    textSize(32);
    text("Tutoriel", width / 2, 50);
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
function openMenu() {
  // Remove existing menu if present
  let oldMenu = document.getElementById("main-menu");
  if (oldMenu) oldMenu.remove();

  // Get the modals HTML and append to body
  Promise.all([
    fetch("/assets/sandboxModal.html").then((response) => response.text()),
    fetch("/assets/settingsModal.html").then((response) => response.text()),
  ]).then(([sandboxModalHTML, settingsModalHTML]) => {
    document.body.insertAdjacentHTML("beforeend", sandboxModalHTML);
    document.body.insertAdjacentHTML("beforeend", settingsModalHTML);
  });
  // Get the static menu HTML and append to #game container
  fetch("/assets/menu.html")
    .then((response) => response.text())
    .then((staticMenuHTML) => {
      let container = document.getElementById("game");
      container.insertAdjacentHTML("beforeend", staticMenuHTML);

      const menu = document.getElementById("main-menu");

      // Dynamic: Tutorial buttons
      const tutorialSection = document.getElementById("tutorialSection");
      levels.forEach((level, idx) => {
        const btn = document.createElement("button");
        btn.innerText = `Level ${idx}`;
        btn.className = "btn btn-outline-dark btn-sm";
        btn.type = "button";
        btn.onclick = () => {
          Game.currentLevel = level;
          menu.remove();
          Game.changeMode(GameState.PLAY);
        };
        tutorialSection.appendChild(btn);
      });
      let seed = generateSeedForDay();
      // Daily challenge buttons
      let level = null;
      document.getElementById("daily1D").onclick = () => {
        level = generateLevel("1D", 4, seed);
        Game.currentLevel = level;
        menu.remove();
        Game.changeMode(GameState.PLAY);
      };
      document.getElementById("daily2D3").onclick = () => {
        level = generateLevel("2D", 3, seed);
        Game.currentLevel = level;
        menu.remove();
        Game.changeMode(GameState.PLAY);
      };
      document.getElementById("daily2D4").onclick = () => {
        Game.currentLevel = generateLevel("2D", 4, seed);
        menu.remove();
        Game.changeMode(GameState.PLAY);
      };

      // Sandbox button
      document.getElementById("sandboxBtn").onclick = () => {
        let n = parseInt(document.getElementById("colorSelect").value);
        let direction = document.getElementById("dimSelect").value;
        let length = n * n;
        let level = {
          id: 999,
          name: `Sandbox_${n}_${direction}`,
          numberOfColors: n,
          direction,
          length,
          values: [],
        };

        // scoreType: Array.from(
        //     document.querySelectorAll('input[name="scoreType"]:checked')
        //   ).map((cb) => cb.value),
        Game.currentLevel = level;
        //close the modal

        menu.remove();
        Game.changeMode(GameState.PLAY);
      };

      // Palette select
      const paletteSelect = document.getElementById("paletteSelect");
      colorPalettes.forEach((palette, idx) => {
        const opt = document.createElement("option");
        opt.value = idx;
        opt.innerText = palette.name || `Palette ${idx + 1}`;
        paletteSelect.appendChild(opt);
      });
      paletteSelect.onchange = () => {
        Game.setPalette(parseInt(paletteSelect.value));
      };

      // Colorblind mode
      const cbCheckbox = document.getElementById("cbCheckbox");
      cbCheckbox.checked = Game.colorblindMode || false;
      cbCheckbox.onchange = () => {
        Game.setColorblindMode(cbCheckbox.checked);
      };

      // Leaderboard button
      document.getElementById("leaderboardBtn").onclick = () => {
        menu.remove();
        Game.showLeaderboard();
      };
    });
}
