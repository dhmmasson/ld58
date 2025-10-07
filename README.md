![Ludum Dare](https://img.shields.io/badge/LudumDare-58-f79122?labelColor=ee5533&link=https%3A%2F%2Fldjam.com%2Fevents%2Fludum-dare%2F58%2Ftiles-collector)
![Ludum Dare 58 - Compo](https://img.shields.io/badge/LudumDare58-Compo-ee5533?&link=https%3A%2F%2Fldjam.com%2Fevents%2Fludum-dare%2F58%2Ftiles-collector)
![p5.js](https://img.shields.io/badge/p5.js-v2.0.5-ED225D?logo=p5.js&logoColor=FFFFFF)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SWH](https://archive.softwareheritage.org/badge/origin/https://github.com/dhmmasson/tilesCollector/)](https://archive.softwareheritage.org/browse/origin/?origin_url=https://github.com/dhmmasson/tilesCollector)
[![SWH](https://archive.softwareheritage.org/badge/swh:1:dir:141992b5d1d2ae0e759c4f88f54aa811931bffa3/)](https://archive.softwareheritage.org/swh:1:dir:141992b5d1d2ae0e759c4f88f54aa811931bffa3)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17289917.svg)](https://doi.org/10.5281/zenodo.17289917)


# Tile Collector

[Tile Collector on Ludum Dare](https://ldjam.com/events/ludum-dare/58/tiles-collector)

## About **Tiles Collector**

**Tiles Collector** is a minimalist puzzle game where you _collect unique color pairs_ by carefully arranging colored tiles in 1D friezes and 2D grids.  
Your goal: fill each row and column to maximize the number of distinct adjacent color pairs — a bit like **dominoes**, a bit like **sudoku**, but with a colorful twist.

The game starts simple, with just two colors in 1D mode, and ramps up the challenge as you unlock more colors and dimensions — from 2, to 3, and finally 4 colors, exploring the full complexity of 2D tiling.

---

## Gameplay Modes

I managed for once to have :

- **A Tutorial Mode** – that guides you through the controls and the game logic
- **3 Daily Challenges** – Three new puzzles every day with _an online leaderboard_.
- **A Sandbox Mode** – Experiment freely and create your own beautiful, balanced grids.

---

## Features

- Clean aesthetic inspired by _The New York Times_ games (coping...) .
- Silent by design — perfect for thoughtful play or your own background music (coping x2).
- Fully web-based, built with **p5.js**, **HTML**, and **CSS**, compatible with desktop and mobile (as much as I could on the only phone I have).
- Developed and hosted using **Quarto** and **GitHub Pages** during the 48-hour jam, with regular commits and releases all along the 48 hours.
- ***

## Behind the Design

This idea has been in my mind for at least eight years, an idea that never quite fit previous Ludum Dare themes until now. Tiles Collector stems from an ongoing mathematical obsession: finding a tiling that simultaneously contains **all possible color pairs** in rows and columns _and_ all possible **2x2 color squares**.
While proven impossible for 2 and 3 colors, the 4-color case remains an open question. I wanted to create a game where player would help me explore that possibility, but I could not manage to add the **2x2 color squares** visualisation and scoring during the jam so part of the mystery is still there.

---

## 🎨 Tech & Tools

- **Engine:** [p5.js](https://p5js.org/), with the `p5.palette` extension for palette support.
- **Color Palette:** Generated using [Coolors.co](https://coolors.co/)
- **Art:**
  - Blender - For the Cover Art
  - Krita - To add text and effect to the splash and cover image

---

## 📜 Licenses

- This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
- The **p5.js** library is distributed under the **LGPL v2.1**.
