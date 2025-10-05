const levels = [
  {
    id: 0,
    name: "Level 0",
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
    name: "Level 1",
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
    name: "Level 2",
    numberOfColors: 2,
    direction: "1D",
    length: 4,
    values: [0, 1, -1, -1],
    info: {
      title: "Creating Pairs",
      text: `In the previous level, you created two pairs at once by placing a tile between two existing tiles.<br>
      with two colors you can create 4 pairs, can you find them all?<br>
      On the right side you can see the pairs you have collected so far.<br>
      The number on the right of the row indicates how many pair are missing.<br>
      a black dot between two tiles means the pairs has been collected more than once`,
      image: "assets/tutorial3.png",
      closeOnClick: true,
    },
  },
  {
    id: 3,
    name: "Level 3",
    numberOfColors: 3,
    direction: "1D",
    length: 9,
    values: [0, -1, -1, -1, 1, -1, -1, -1, 0],
  },
  {
    id: 4,
    name: "Level 4",
    numberOfColors: 4,
    direction: "1D",
    length: 16,
    values: [0, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 0],
  },
  {
    id: 5,
    name: "Level 5",
    numberOfColors: 3,
    direction: "2D",
    length: 9,
    values:
      "001021122x2112200122001021112200102120x102112211220010112200102112200102102112200"
        .split("")
        .map((c) => +c),
  },
  {
    id: 5,
    name: "Level 5",
    numberOfColors: 3,
    direction: "2D",
    length: 9,
    values: "".split("").map((c) => +c),
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
