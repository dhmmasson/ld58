const levels = [
  {
    id: 0,
    name: "Tile Picker Tutorial",
    numberOfColors: 4,
    direction: "1D",
    length: 1,
    values: [-1],
    info: {
      title: "Welcome to Tiles Collector!",
      text: `In Tiles Collectors you place tiles to form a frise or a tilling to collect unique pairs. 
      Learn to place a tile by clicking or pressing the white square. <br>
      Change the color of the tile to orange`,
      image: "assets/tutorial1.png",
      closeOnClick: true,
    },
    end: {
      check: (gridInfo) => gridInfo.values[0][0].color == 0,
      info: {
        title: "Great!",
        text: `You placed your first tile! Depending on the level, 
        you will have 2, 3 or 4 colors to work with.<br>`,
        closeOnClick: true,
        nextLevel: 1,
      },
    },
  },
  {
    id: 1,
    name: "Orange and Yellow Pair",
    numberOfColors: 2,
    direction: "1D",
    length: 2,
    values: [0, -1],
    info: {
      title: "Creating Pairs",
      text: `In tiles Collector, you need to create pairs of colors by placing tiles next to each other.<br>
      Some tiles are already placed for you and <strong> cannot be changed</strong>.<br>
      Try to create a pair Orange-Yellow by placing a second tile next to the first one.`,

      closeOnClick: true,
    },
    end: {
      check: (gridInfo) =>
        gridInfo.values[0][0].color == 0 && gridInfo.values[0][1].color == 1,
      info: {
        title: "Well done!",
        text: `You created your first pair!<br>
        Actually, you created two pairs at once: Orange-Yellow and Yellow-Orange!<br> 
        Imagine the frise repeating infinitely in both directions... So we count the pair that is formed by the tiles at the edges.<br>`,
        image: "assets/tutorial2_end.png",
        closeOnClick: true,
        nextLevel: 2,
      },
    },
  },
  {
    id: 2,
    name: "All Pairs with Two Colors",
    numberOfColors: 2,
    direction: "1D",
    length: 4,
    values: [0, 1, -1, -1],
    info: {
      title: "Creating Pairs",
      text: `In the previous level, you created two pairs at once by placing a tile between two existing tiles.<br>
      <br>
      With two colors you can <strong>collect 4 pairs</strong>, can you find them all?
      <br>
      <br>
      On the right side you can see the pairs you have collected so far.<br>
      The number on the right of the row indicates how many pairs you have collected on that row.<br>
      <br>
      A black dot between two tiles means the pairs have been collected more than once`,
      image: "assets/tutorial3.png",
      closeOnClick: true,
    },
    end: {
      check: (gridInfo) => gridInfo.totalScore == 4,
      info: {
        title: "Great!",
        text: `You collected all the pairs!<br>
        With two colors there are only 4 possible pairs, but with more colors the number of pairs increases quickly!<br>
        <br>
        In the next level you will have 3 colors to work with.`,
        closeOnClick: true,
        nextLevel: 3,
      },
    },
  },
  {
    id: 3,
    name: "Three Colors",
    numberOfColors: 3,
    direction: "1D",
    length: 9,
    values: [0, -1, -1, -1, 1, -1, -1, -1, 0],
    info: {
      title: "Three Colors",
      text: `With three colors, there are 9 possible pairs to collect.<br>
      Can you find them all?`,
    },
    end: {
      check: (gridInfo) => gridInfo.totalScore == 9,
      info: {
        title: "Well done!",
        text: `You collected all the pairs!<br>
        With three colors there are 9 possible pairs, but with four colors there are 16 possible pairs!<br>
        <br>
        In the next level you will have 4 colors to work with.`,
        closeOnClick: true,
        nextLevel: 4,
      },
    },
  },
  {
    id: 4,
    name: "Four Colors",
    numberOfColors: 4,
    direction: "1D",
    length: 16,
    values: [0, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 0],
    info: {
      title: "Four Colors",
      text: `With four colors, there are 16 possible pairs to collect.<br>
      Can you find them all?
      <br><br>
      Some of the tiles are already placed for you, and cannot be changed.<br>
      visit the sandbox mode to play without any pre-placed tiles.`,
    },
    end: {
      check: (gridInfo) => gridInfo.totalScore == 16,
      info: {
        title: "Congratulations!",
        text: `You collected all the pairs!<br>`,
        nextLevel: 5,
        closeOnClick: true,
      },
    },
  },
  {
    id: 5,
    name: "Two Colors in 2D",
    numberOfColors: 2,
    direction: "2D",
    length: 4,
    values: "".split("").map((c) => +c),
    info: {
      title: "Two Dimensions",
      text: `In this level, you will work in two dimensions!<br>
      You can create pairs not only horizontally but also vertically.<br>
      there are 16 pairs to collect horizontally and 16 pairs to collect vertically.<br>
      Can you find all the pairs in this 2D grid?`,
    },
    end: {
      check: (gridInfo) => gridInfo.totalScore == 4 * 4 * 2,
      info: {
        title: "Well done!",
        text: `You collected all the pairs in 2D!<br>
        With four colors in 2D there are 32 possible pairs!<br>`,
        closeOnClick: true,
        nextLevel: 6,
      },
    },
  },
  {
    id: 6,
    name: "Three Colors in 2D",
    numberOfColors: 3,
    direction: "2D",
    length: 9,
    values: `0xxx21122
       x21x2x001
       2z001x211
       x2xx0102x
       2zx1021x2
       21x2xx010
       x122xxx02
       1122xx1x2
       10x112x0x`
      .replace(/\s+/g, "")
      .split("")
      .map((c) => +c),
    info: {
      title: "Three Colors in 2D",
      text: `There exist grids that maximize the number of pairs in 2D. But they are boring (you just need to offset the rows)<br>
      So in this level, some tiles are already placed for you, and cannot be changed.<br>
      There exist a solution where all the rows have 9 unique pairs, can you find it?`,
      closeOnClick: true,
    },
    end: {
      check: (gridInfo) =>
        gridInfo.rowScores.every(
          (row) => row.filter((pair) => pair.count == 1).length == 9
        ),
      info: {
        title: "Congratulations!",
        text: `You found a solution where all the rows have 9 unique pairs!<br>
        <br>
        You can now can try to get the highest score in the daily challenges or in sandbox mode!`,
        closeOnClick: true,
        nextLevel: -1,
      },
    },
  },
];

function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function realize(hash, length) {
  const permutation = [];
  const available = Array.from({ length: length }, (_, i) => i + 1); // Elements [1, 2, ..., n]
  // Start with the factorial of (n - 1) for the first element
  let factorialValue = factorial(length);
  for (let i = 1; i <= length; i++) {
    hash %= factorialValue;
    factorialValue = factorial(length - i); // Factorial for current level
    // Determine which element to choose based on the index
    const rank = Math.floor(hash / factorialValue);
    permutation.push(available[available.length - rank - 1]); // Select element from the end
    available.splice(available.length - rank - 1, 1); // Remove the used element
    // Update the index to focus on the remainder
  }
  return permutation.map((e) => e - 1);
}

function generateMask(seed, length, target) {
  randomSeed(seed);
  let tries = 1000;
  let mask = Array(length).fill(0);
  while (target > 0 && --tries > 0) {
    let i = Math.floor(random(0, length));
    if (mask[i] === 0) {
      mask[i] = 1;
      target--;
    }
  }
  return mask;
}

function generateValuesFromSeed(numberOfColors, length, seed = 0) {
  // From the seed we need to get :
  // 1. a permutation of the colors
  // 2. a sequence of colors of the given length from the reducedFrize, or if 2d multiple sequences
  // 3. a offset to start in the sequence
  // 4. a mask to remove some tiles
  let s2 = seed;

  let k = seed % numberOfColors;
  let permutation = realize(k, numberOfColors);
  seed = Math.ceil(seed / numberOfColors);
  let n = numberOfColors * numberOfColors;
  let values = [];
  while (values.length < length) {
    k = seed % reducedFrize[numberOfColors].length;
    seed = Math.ceil(seed / 7);
    values.push(
      ...reducedFrize[numberOfColors][k].split("").map((e) => permutation[e])
    );
  }

  let mask = generateMask(s2, length, Math.floor(length * 0.3));

  values = values.map((e, i) => (mask[i] ? e : -1));

  let offset = seed % length;
  values = values.slice(offset).concat(values.slice(0, offset));

  return values;
}
function hashValueToSeed(numberOfColors, values) {
  let seed = 0n;
  values.forEach((v) => {
    seed = (seed << 3n) | (v + 1n);
  });
  return seed;
}

/**
 * Generates a level configuration based on direction and number of colors.
 * @param {"1D"|"2D"} direction - The direction of the level ("1D" or "2D").
 * @param {number} numberOfColors - The number of colors in the level.
 * @param {BigInt} [seed=0] - Optional seed for random generation.
 */
function generateLevel(direction, numberOfColors, seed) {
  let length = numberOfColors * numberOfColors;
  let valueLength = direction === "2D" ? length * length : length;

  let values = generateValuesFromSeed(numberOfColors, valueLength, seed);
  let level = {
    id: seed,
    name: `${numberOfColors}-${direction}-${seed}`,
    direction,
    numberOfColors,
    length,
    values,
  };

  return level;
}

function generateSeedForDay(date = new Date()) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const str = `${year}-${month}-${day}`;
  // Simple hash function to convert date string to a number
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
