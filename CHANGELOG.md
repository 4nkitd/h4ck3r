# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md`
- GitHub Actions CI: typecheck + build on PR and push to `main`

### Fixed
- Version drift between `package.json` and `manifest.json` (both aligned to 0.2.0)

---

## [0.2.0] — current

The "modern rewrite" release. Full revamp under Vite + TypeScript with a side-panel UX.

### Added
- Side-panel mode (replaces popup as default surface)
- Icon sidebar with hover tooltips
- Command palette (`⌘K` / `Ctrl+K`)
- Keyboard shortcuts for encode (`⌘⇧E`) and decode (`⌘⇧D`)
- Floating toolbar on pages (disable-able in options)
- Payload libraries: SQL injection, XSS, LFI, reverse shells (categorized)
- Linux command reference
- JWT decoder (auto-pulls tokens from localStorage / sessionStorage / cookies)
- Domain extractor with clipboard copy
- JSON beautifier, timestamp converter, hash generator (MD5/SHA1/SHA256/SHA512)
- ModHeader-style HTTP header modifier
- Store listing assets in `store_assets/`

### Changed
- Migrated to Manifest V3
- Migrated build system to Vite + TypeScript
- Project restructured: `src/popup`, `src/background`, `src/content`, `src/lib`, `src/styles`
- README rewritten with full feature list, install, usage, development sections
- Dark theme as default

### Notes
- No git tag exists for 0.2.0 yet; this section captures the work between `0.0.8` and the current `main`.

---

## [0.0.8] — 2021-04-10

### Added
- Toolbar auto-hide enabled by default for all sites

---

## [0.0.7] — 2021-04-02

### Added
- Toolbar position is now remembered between sessions

### Changed
- Toolbar UI refresh
- Stack Overflow autoselect support

### Fixed
- Stack Overflow UI rendering issue

---

## [0.0.5] — 2021-03-11

### Added
- Initial form-filler implementation

### Changed
- Repo cleanup, README updates

---

## [0.0.4] — 2021-03-07

### Added
- Copy-to-clipboard on result panels
- Demo URL and funding option in README

### Changed
- README notes and minor edits

---

## [0.0.3] — 2021-02-27

### Added
- JSON beautifier

### Fixed
- JSON syntax handling issue

---

## [0.0.2] — 2021-02-26

Initial public release.

---

[Unreleased]: https://github.com/4nkitd/h4ck3r/compare/0.0.8...HEAD
[0.2.0]: https://github.com/4nkitd/h4ck3r/compare/0.0.8...HEAD
[0.0.8]: https://github.com/4nkitd/h4ck3r/compare/0.0.7...0.0.8
[0.0.7]: https://github.com/4nkitd/h4ck3r/compare/0.0.5...0.0.7
[0.0.5]: https://github.com/4nkitd/h4ck3r/compare/0.0.4...0.0.5
[0.0.4]: https://github.com/4nkitd/h4ck3r/compare/0.0.3...0.0.4
[0.0.3]: https://github.com/4nkitd/h4ck3r/compare/0.0.2...0.0.3
[0.0.2]: https://github.com/4nkitd/h4ck3r/releases/tag/0.0.2
