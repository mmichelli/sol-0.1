# Agent guide — adding new wall drawings

This file is for AI agents asked to generate more instructions for this
project. Read it end-to-end before starting.

## The task

Add one or more new wall drawings to `drawings/NNN-slug.html`, update
`index.html`, and render a preview. Each drawing is a Sol LeWitt-style
instruction (a few sentences of prose) implemented three ways in p5.js:

1. the **original** solution, faithful to the instruction
2. two **oblique-strategy perturbations** — alternate readings seeded
   by an [Oblique Strategies](https://en.wikipedia.org/wiki/Oblique_Strategies)
   card

`drawings/runner.js` picks one of the three at random on each page load
and renders it on a 720×720 canvas.

## Process

### 1. Fetch external seeds

The instruction must be **seeded by something external and random** —
not invented by the agent. Sandboxed environments may block public
networks; here is what currently works:

- **Wikipedia** (preferred when reachable): `https://en.wikipedia.org/wiki/Special:Random`.
  Instructions 022–031 were seeded this way.
- **Webster's 1913 dictionary** (current fallback): the
  `matthewreagan/WebstersEnglishDictionary` repo on GitHub hosts a
  JSON dump of ~102k entries. Pull it via
  `raw.githubusercontent.com` (no API rate limit) and sample 9 random
  entries with 200–600 char definitions. Instructions 032–040 were
  seeded this way.
- **Project Gutenberg** (alternative): the GITenberg org mirrors books
  at `raw.githubusercontent.com/GITenberg/<Title>_<PGID>/master/<PGID>.txt`.
  Strip PG header/footer, then sample random sentences.

Each drawing should have exactly one seed. Record the seed in the HTML
card as a `<p class="source">` line:

```html
<p class="source">Seed — <em>term-or-title</em>: short phrase from the source.</p>
```

### 2. Generate the instruction

Compose a single paragraph of 1–3 sentences in Sol LeWitt's voice:
imperative, geometric, precise. Read existing drawings for tone —
001 through 040. Translate the seed's *meaning* into a drawing rule
(e.g. "gallicanism → a centre zone competing with a surrounding
zone"); the seed is a prompt, not a brief.

### 3. Pick two oblique strategies

Pick two real cards from the Oblique Strategies deck (e.g. "Honor thy
error as a hidden intention", "Turn it upside down", "Water",
"Repetition is a form of change", "Ghost echoes", "Mute and continue"…).
Each strategy should produce a visibly different rendering from the
original — not a trivial parameter tweak.

### 4. Write the HTML file

Name the file `drawings/NNN-slug.html` where `NNN` is the next sequential
three-digit number and `slug` is a short kebab-case handle (usually the
seed's headword or a one-word distillation). Use this template:

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wall Drawing NNN</title>
<script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
<script>if (window.self !== window.top || location.search.includes('embed')) document.documentElement.classList.add('embedded');</script>
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="stylesheet" href="shared.css">
</head>
<body>
<div class="card">
  <h1>#NNN</h1>
  <p>The instruction here.</p>
  <p class="source">Seed — <em>term</em>: short phrase from the source.</p>
  <p class="strategy" id="strategy"></p>
</div>
<div class="holder" id="h"></div>
<script>
const solutions = [
  { strategy: null, draw: (p) => { /* original */ } },
  { strategy: "Strategy card text", draw: (p) => { /* perturbation 1 */ } },
  { strategy: "Strategy card text", draw: (p) => { /* perturbation 2 */ } },
];
</script>
<script src="runner.js"></script>
</body>
</html>
```

Drawing conventions:

- **Canvas**: always 720×720, created by `runner.js` — don't call
  `createCanvas` yourself. Use `p.width` / `p.height`.
- **Background**: white (set by `runner.js`). Don't call `background()`.
- **Margin**: leave ~30–60px of breathing room from the edge.
- **Palette**: prefer the LeWitt primaries plus black:
  red `[200,40,40]`, yellow `[240,200,40]`, blue `[40,80,200]`,
  black `[20,20,20]`. Occasional green `[40,140,70]` or brown
  `[140,85,40]` when the seed demands it.
- **Stroke weight**: 0.8–1.4 for most linework. Fills should be flat.
- **Randomness**: call `p.random()` freely — each re-render rolls fresh.
- **Performance**: keep total draw under ~1s. Avoid recursion deeper
  than ~8 levels; see #026's cap for precedent.

### 5. Update `index.html`

Append an entry to the `drawings` array at the bottom of the
`drawings = [ … ]` literal. Keep the columns aligned with neighbours.
The instruction here is the gallery blurb — the same prose as the HTML
card, optionally trimmed.

### 6. Build the preview

`build-previews.sh` requires system `chromium` on PATH. If it isn't
available, use Playwright's bundled chromium:

```js
// /tmp/render.mjs
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
import path from 'path';
const { chromium } = pw;
const root = '/home/user/sol-0.1';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 720, height: 720 } });
// Route the p5 CDN to a local copy if cdn.jsdelivr.net is blocked:
const p5Body = fs.readFileSync('/tmp/p5.min.js');
await ctx.route('**/p5@*/lib/p5.min.js', r =>
  r.fulfill({ contentType: 'application/javascript', body: p5Body })
);
const page = await ctx.newPage();
for (const rel of process.argv.slice(2)) {
  const num = path.basename(rel).slice(0, 3);
  await page.goto(`file://${path.join(root, rel)}?embed=1`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('canvas') !== null);
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(root, 'previews', `${num}.png`),
    clip: { x: 0, y: 0, width: 720, height: 720 },
  });
}
await browser.close();
```

To get `/tmp/p5.min.js`: `cd /tmp && npm pack p5@1.9.4 && tar -xzf p5-1.9.4.tgz && cp package/lib/p5.min.js /tmp/p5.min.js`.

The preview captures whichever of the three solutions `runner.js`
happened to roll, which is fine — the gallery shows one sample, and
the user can re-roll by clicking through.

### 7. Commit

One commit per batch of drawings. Add all HTML + preview files +
`index.html` and `README.md` changes together. Use the existing
commit-message style — see `git log`.

Never skip hooks. Never force-push.

## Quality bar

A good drawing:
- has an instruction that would be interesting **even without a
  preview** — it can be read like a poem
- has three solutions that are clearly distinct in the rendered image
- respects the seed without being literal-minded about it
- has compact, self-contained JS (target <120 lines per HTML file)

If a perturbation produces a rendering visually identical to the
original, discard it and pick a different strategy.
