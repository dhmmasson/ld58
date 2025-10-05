/**
 * HTML based info box, overlay on top of the canvas
 * Div inserted in the #game Div container, positioned relative, contains a content div that is at most 360px wide, centered
 * The content div has a white background, black border, some padding and a close button at the top right corner
 * The close button is a simple "X" text, positioned absolute at the top right corner of the content div
 * The info box is hidden by default, and shown when the infoBox function is called
 * The info box can be closed by clicking the close button or by clicking outside the content div
 * @param title HTML
 * @param text
 */
function infoBox(title, text, image, closeOnClick = false, nextLevel = null) {
  console.log("Show info box", title, nextLevel);
  let container = document.getElementById("game");
  let box = document.createElement("div");
  box.id = "infoBox";
  box.innerHTML = `
    <div class="content">
      <h2>${title}</h2>
      <p>${text}</p>
      ${image ? `<img src="${image}" alt="Info Image" />` : ""}
      <button class="close">X</button>
      ${
        nextLevel
          ? `<button class="btn btn-primary mt-3">Next Level</button>`
          : ""
      }
    </div>
  `;

  container.appendChild(box);

  function closeBox() {
    console.log("Close info box", nextLevel);
    container.removeChild(box);
    if (nextLevel !== null) {
      console.log("Go to next level", nextLevel);
      if (nextLevel === -1) {
        Game.changeMode(GameState.MENU);
        return;
      }
      Game.currentLevel = levels[nextLevel];
      Game.changeMode(GameState.PLAY);
    }
  }

  if (closeOnClick) {
    box.style.cursor = "pointer";
    setTimeout(() => {
      box.addEventListener("click", (event) => {
        closeBox();
      });
    }, 1500); // prevent immediate close if called on click
  }

  box.querySelector(".close").addEventListener("click", () => {
    closeBox();
  });
  box.addEventListener("click", (event) => {
    if (event.target === box) {
      closeBox();
    }
  });
}
