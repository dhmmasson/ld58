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
function infoBox(
  title,
  text,
  image,
  closeOnClick = false,
  nextLevel = null,
  leaderBoard = null
) {
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
      ${
        leaderBoard
          ? `<div id="leaderBoardSection">
        <h3>Leaderboard</h3>
        <div id="leaderBoardContent">Loading...</div>
        <input type="text" id="leaderNameInput" placeholder="Enter your name" />
        <button id="sendLeaderNameBtn">Send</button>
        </div>`
          : ""
      }
    </div>
  `;

  if (leaderBoard) {
    const leaderBoardContent = box.querySelector("#leaderBoardContent");
    const sendLeaderNameBtn = box.querySelector("#sendLeaderNameBtn");
    const leaderNameInput = box.querySelector("#leaderNameInput");
    //[{"name":"ta++ta++sahu_1745415404786","score":"17","seconds":"0","text":"","date":"10/5/2025 1:12:15 PM"}]
    // Fetch and display leaderboard scores
    getScores(leaderBoard).then((scores) => {
      if (scores.length === 0) {
        leaderBoardContent.innerHTML = "<p>No scores yet.</p>";
        return;
      }
      const list = document.createElement("ol");
      if (!Array.isArray(scores)) {
        scores = [scores];
      }
      scores.forEach((entry) => {
        const item = document.createElement("li");
        item.textContent = `${entry.name}: ${entry.score} in ${entry.seconds}s `;

        list.appendChild(item);
      });
      leaderBoardContent.innerHTML = "";
      leaderBoardContent.appendChild(list);
    });

    // Handle sending new score
    sendLeaderNameBtn.addEventListener("click", () => {
      const name = leaderNameInput.value.trim();
      if (name === "") {
        alert("Please enter your name.");
        return;
      }
      // Assuming score is stored in Game.currentLevel.score and time in Game.currentLevel.time
      const score = Game.currentLevel.score || 0;
      const time = Game.currentLevel.time || 0;
      console.log("Submitting score", name, score, time);
      submitScore(leaderBoard, name, score, time)
        .then(() => getScores(leaderBoard))
        .then((scores) => {
          if (scores.length === 0) {
            leaderBoardContent.innerHTML = "<p>No scores yet.</p>";
            return;
          }
          const list = document.createElement("ol");
          console.log("Updated scores", scores);
          if (!Array.isArray(scores)) {
            scores = [scores];
          }
          scores.forEach((entry) => {
            const item = document.createElement("li");
            item.textContent = `${entry.name}: ${entry.score} in ${entry.seconds}s `;
            list.appendChild(item);
          });
          leaderBoardContent.innerHTML = "";
          leaderBoardContent.appendChild(list);
        });
    });
  }

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
