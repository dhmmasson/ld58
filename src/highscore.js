const privateKeys = {
  daily1D: "gH17vCt6G0W2dJC9SzKChAijufOea8ZUiv30ZuN2pqqw", // Replace with your actual private code
  daily2D3: "yV7h_o5QzkGYDv1x97LKngLHMFZovBuUaglOTCtoTGFQ", // Replace with your actual private code
  daily2D4: "yn-N5KwdOkScT0-dg9c7YA2AA4Zjvx1UCFuiDDg_zCyA", // Replace with your actual private code
};

async function sendRequestDreamlo(key, command, user, score, time) {
  let url = `https://dreamlo.com/lb/${privateKeys[key]}`;

  switch (command) {
    case "add":
      url += `/add/${encodeURIComponent(user)}/${score}/${time}`;
      break;
    case "json":
      url += `/json${key === "daily1D" ? "-seconds-asc" : ""}`;
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (command === "add") {
      return await response.text();
    } else if (command === "json") {
      const text = await response.json();
      return text;
    }
  } catch (error) {
    console.error("Error sending request to Dreamlo:", error);
    throw error;
  }
}

async function submitScore(mode, user, score, time) {
  try {
    const response = await sendRequestDreamlo(mode, "add", user, score, time);
    console.log("Score submitted successfully:", response);
  } catch (error) {
    console.error("Failed to submit score:", error);
  }
}
async function getScores(mode) {
  try {
    const response = await sendRequestDreamlo(mode, "json", "", "");

    return response.dreamlo.leaderboard.entry;
  } catch (error) {
    console.error("Failed to retrieve scores:", error);
    return [];
  }
}
