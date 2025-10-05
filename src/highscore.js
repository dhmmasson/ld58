const privateKeys = {
  daily1D: "gH17vCt6G0W2dJC9SzKChAijufOea8ZUiv30ZuN2pqqw", // Replace with your actual private code
  daily2D3: "yV7h_o5QzkGYDv1x97LKngLHMFZovBuUaglOTCtoTGFQ", // Replace with your actual private code
  daily2D4: "yn-N5KwdOkScT0-dg9c7YA2AA4Zjvx1UCFuiDDg_zCyA", // Replace with your actual private code
};

async function sendRequestDreamlo(key, command, user, score) {
  const url = `https://dreamlo.com/lb/${
    privateKeys[key]
  }/${command}/${encodeURIComponent(user)}/${score}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error sending request to Dreamlo:", error);
    throw error;
  }
}

async function submitScore(mode, user, score) {
  try {
    const response = await sendRequestDreamlo(mode, "add", user, score);
    console.log("Score submitted successfully:", response);
  } catch (error) {
    console.error("Failed to submit score:", error);
  }
}
async function getScores(mode) {
  try {
    const response = await sendRequestDreamlo(mode, "pipe", "", "");
    const scores = response
      .trim()
      .split("\n")
      .map((line) => {
        const [name, score, date] = line.split("|");
        return { name, score: parseInt(score), date };
      });
    return scores;
  } catch (error) {
    console.error("Failed to retrieve scores:", error);
    return [];
  }
}
