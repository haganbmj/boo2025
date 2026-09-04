# AGENTS.md

## Project

Static site of MTG-style playing card image galleries for **CubeCon "Build Our Own Draft"**, one gallery per year, deployed to GitHub Pages. No package.json, no bundler, no dependencies — just plain HTML/CSS and one Node script per year.

## Layout

The repo is organized by year. Each `YYYY/` directory is a self-contained gallery.

- `2025/` — the 2025 gallery (populated).
- `2026/` — the 2026 gallery (to be populated; currently empty).
- [.gitignore](.gitignore), [README.md](README.md), this file at the root.

Inside a year directory (see [2025/](2025/) as the reference example):

- `index.html` — the served page for that year. All CSS is inline; all card markup lives between the `<!-- GENERATED CONTENT BELOW -->` and `<!-- END GENERATED CONTENT -->` markers.
- `generate.mjs` — ESM Node script (uses only `fs`) that scans `./img/*/` **relative to its own directory** and writes `./generated.html`.
- `img/<contributor>/*.{jpg,jpeg,png}` — served images. One subfolder per contributor. Filenames are typically `NNNN Card Name.jpg`.
- `raw/`, `generated.html` — gitignored working directories/output. `raw/` and `temp/` (anywhere) plus `<year>/generated.html` are excluded via [.gitignore](.gitignore); do NOT commit them.

New years should mirror this layout. When bootstrapping `2026/`, copy `2025/index.html` and `2025/generate.mjs` as starting points and clear the `remaps` object and the generated block.

## The build workflow (important — non-obvious)

`generate.mjs` writes to `generated.html`, but `generated.html` is **gitignored and never served**. The output must be manually pasted into the sibling `index.html` between the two `GENERATED CONTENT` markers.

To rebuild a year's gallery (example: 2025):

1. Add/remove images under `2025/img/<contributor>/`.
2. If adding a new contributor folder, add a matching entry to the `remaps` object in `2025/generate.mjs` — otherwise the script throws `TypeError: Cannot read properties of undefined (reading 'name')`.
3. From inside the year directory, run: `cd 2025 && node generate.mjs` (the script uses relative paths, so cwd must be the year directory).
4. Replace the contents of the `GENERATED CONTENT` block in `2025/index.html` with the contents of `2025/generated.html`.
5. Commit `2025/index.html` (and any new `2025/img/` files). Do not commit `2025/generated.html`.

## Conventions

- **Image extensions** picked up by the generator: `.jpg`, `.jpeg`, `.png` (case-insensitive, via extension check). Anything else is silently skipped.
- **Card aspect ratio** is fixed by CSS to `325 / 451` (standard MTG card). New images should conform or they'll be squished.
- **Colors** use the [Nord palette](https://www.nordtheme.com/) via CSS custom properties (`--nord0`..`--nord15`) declared at the top of each year's `index.html`. Reuse these vars instead of hardcoding hex values.
- **Section IDs** in the generated HTML match the folder name (e.g. `<section id="ancestral">`); the visible `<h2>` uses `remaps[folder].name`.
- Filenames with spaces are intentional (used verbatim in `src`, `alt`, and the visually-hidden `.hidden-label` used for in-page search).

## Things NOT to do

- Don't introduce a package.json, bundler, or framework — the "I'm too lazy to webpack this" comment in `index.html` is a stated preference.
- Don't commit `<year>/generated.html`, `raw/`, `temp/`, or `.DS_Store`.
- Don't edit the card markup in a year's `index.html` by hand for bulk changes — regenerate via that year's `generate.mjs` instead.
- Don't rename folders under `<year>/img/` without also updating `remaps` in `<year>/generate.mjs`.
- Don't cross-reference assets between years — each `YYYY/` directory is self-contained and uses relative paths (`./img/...`) that only resolve within that directory.
