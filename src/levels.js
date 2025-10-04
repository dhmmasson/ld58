const levels = [
  {
    id: 0,
    name: "Level 0",
    numberOfColors: 4,
    direction: "1D",
    length: 1,
    values: [-1],
  },
  {
    id: 1,
    name: "Level 1",
    numberOfColors: 2,
    direction: "1D",
    length: 2,
    values: [0, -1],
  },
  {
    id: 2,
    name: "Level 2",
    numberOfColors: 2,
    direction: "1D",
    length: 4,
    values: [0, 1, -1, -1],
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
];
