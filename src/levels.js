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
        Imagine the frise repeating infinitely in both directions... So we count`,
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
