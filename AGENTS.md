# AGENTS.md

## Project

Static single-page gallery of MTG-style playing card images for **CubeCon BOO 2025**, deployed to GitHub Pages at `boo2025.griselbrand.com` (see [CNAME](CNAME)). No package.json, no bundler, no dependencies — just plain HTML/CSS and one Node script.

## Layout

- [index.html](index.html) — the served page. All CSS is inline; all card markup lives between the `<!-- GENERATED CONTENT BELOW -->` and `<!-- END GENERATED CONTENT -->` markers.
- [generate.mjs](generate.mjs) — ESM Node script (uses only `fs`) that scans `img/*/` and writes [generated.html](generated.html).
- `img/<contributor>/*.{jpg,jpeg,png}` — served images. One subfolder per contributor. Filenames are typically `NNNN Card Name.jpg`.
- `raw/`, `temp/`, `generated.html` — gitignored working directories/output; do NOT commit these (see [.gitignore](.gitignore)).

## The build workflow (important — non-obvious)

`generate.mjs` writes to `generated.html`, but `generated.html` is **gitignored and never served**. The output must be manually pasted into [index.html](index.html) between the two `GENERATED CONTENT` markers.

To rebuild the gallery:

1. Add/remove images under `img/<contributor>/`.
2. If adding a new contributor folder, add a matching entry to the `remaps` object in [generate.mjs](generate.mjs) — otherwise the script throws `TypeError: Cannot read properties of undefined (reading 'name')`.
3. Run: `node generate.mjs`
4. Replace the contents of the `GENERATED CONTENT` block in [index.html](index.html) with the contents of `generated.html`.
5. Commit `index.html` (and any new `img/` files). Do not commit `generated.html`.

## Conventions

- **Image extensions** picked up by the generator: `.jpg`, `.jpeg`, `.png` (case-insensitive, via extension check). Anything else is silently skipped.
- **Card aspect ratio** is fixed by CSS to `325 / 451` (standard MTG card). New images should conform or they'll be squished.
- **Colors** use the [Nord palette](https://www.nordtheme.com/) via CSS custom properties (`--nord0`..`--nord15`) declared at the top of `index.html`. Reuse these vars instead of hardcoding hex values.
- **Section IDs** in the generated HTML match the folder name (e.g. `<section id="ancestral">`); the visible `<h2>` uses `remaps[folder].name`.
- Filenames with spaces are intentional (used verbatim in `src`, `alt`, and the visually-hidden `.hidden-label` used for in-page search).

## Things NOT to do

- Don't introduce a package.json, bundler, or framework — the "I'm too lazy to webpack this" comment in `index.html` is a stated preference.
- Don't commit `generated.html`, `raw/`, `temp/`, or `.DS_Store`.
- Don't edit the card markup in `index.html` by hand for bulk changes — regenerate via `generate.mjs` instead.
- Don't rename folders under `img/` without also updating `remaps` in `generate.mjs`.
