# Contributing to h4ck3r

Thanks for considering a contribution. This guide covers the dev loop, conventions, and how to add common things.

## Dev setup

Prereqs:

- Node.js 20+
- npm (ships with Node)
- Chrome / Chromium / Firefox / Edge

Clone and install:

```bash
git clone https://github.com/4nkitd/h4ck3r.git
cd h4ck3r
npm install
```

Dev build (with watch):

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Create a zip for store submission:

```bash
npm run build:zip
```

Load the unpacked extension in Chrome:

1. Open `chrome://extensions`
2. Toggle **Developer mode** on
3. Click **Load unpacked**
4. Select the `dist/` folder

## Branches and commits

- Branch from `main`: `feat/<short-name>`, `fix/<short-name>`, `docs/<short-name>`, etc.
- Use [Conventional Commits](https://www.conventionalcommits.org/) — examples:
  - `feat(payloads): add LFI windows category`
  - `fix(jwt): handle tokens with missing exp claim`
  - `docs(readme): add screenshot for command palette`
- One logical change per PR. Small PRs review faster.

## Pull request checklist

Before opening a PR:

- [ ] `npm run build` succeeds
- [ ] TypeScript has no errors (`npx tsc --noEmit`)
- [ ] Manually tested in at least one browser (state which one in the PR description)
- [ ] README / docs updated if behavior changed
- [ ] CHANGELOG entry added under `## [Unreleased]`
- [ ] No secrets / API keys / personal paths committed

## Adding a new payload

Payloads live in `src/lib/` (one file per category). To add a new payload set:

1. Create `src/lib/payloads/<category>.json` (or extend an existing file)
2. Each entry must have:
   - `name` — short, descriptive
   - `payload` — the raw string
   - `description` — one-line context
   - `tags` — array of strings (e.g. `["mysql", "union-based"]`)
3. Register the file in the side-panel renderer (follow an existing pattern in `src/popup/`)
4. Add a screenshot or note to the PR if the UI changes

Quality bar: payloads must work against a recent target (don't ship 10-year-old vendor-specific exploits without context). Cite a reference if non-obvious.

## Adding a new tool

A "tool" is a side-panel feature like the JWT decoder or base64 encoder.

1. Create the tool component under `src/popup/tools/<tool-name>/`
2. Register it in the side-panel router and icon sidebar
3. If it does encoding / hashing, place the pure function in `src/lib/` so it can be tested independently
4. Add keybinding to `src/popup/keybindings.ts` if applicable
5. Document the tool in the README's feature list

## Reporting security issues

Do **not** open a public issue for security problems. See [`SECURITY.md`](SECURITY.md).

## Code of conduct

Be kind. No harassment, no discrimination, no off-topic noise. Maintainers reserve the right to close issues or PRs that don't help the project move forward.

## Release process

Maintainers only. See `RELEASING.md` once it exists. Short version: bump version in both `package.json` and `manifest.json`, update `CHANGELOG.md`, tag, push, let CI build the zip, manually upload to Chrome / Firefox / Edge until store automation is in place.

## Questions

Open a [GitHub Discussion](https://github.com/4nkitd/h4ck3r/discussions) or join the [Discord](https://discord.gg/gFcewQUA).
