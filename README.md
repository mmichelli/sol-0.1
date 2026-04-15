# sol 0.1

Wall drawings after Sol LeWitt, executed in the browser with p5.js. Most drawings have two solutions: one original, and one perturbed by an [Oblique Strategy](https://en.wikipedia.org/wiki/Oblique_Strategies) card. Each render rolls fresh randomness.

Instructions 022–031 were seeded by a random Wikipedia article. Instructions 032–080 were seeded by a random entry from Webster's 1913 dictionary; 041–050 are a study of colour and shape, 051–060 a study of line, 061–070 a study of three-dimensional primitives, and 071–080 a study of the wave — thick, sinuous, coloured.

## Run locally

Open `index.html` in a browser. The gallery shows pre-rendered PNG thumbnails; click a tile to open the live p5.js page.

## Rebuild previews

```
./build-previews.sh
```

Requires `chromium` on PATH. Renders each drawing at 720×720 in headless mode.

## Structure

- `index.html` — gallery grid
- `drawings/NNN-*.html` — one file per drawing, each self-contained with p5.js
- `drawings/shared.css`, `drawings/runner.js` — shared UI
- `previews/NNN.png` — static thumbnails
- `favicon.svg`

## Credits

- Sol LeWitt (1928–2007) — wall drawings
- Brian Eno & Peter Schmidt — Oblique Strategies (1975)
- [wholepixel/solving-sol](https://github.com/wholepixel/solving-sol) — inspired this project
