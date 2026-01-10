# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-10

### Added
- Full internationalization (i18n) support with WordPress translation system
- Greek (el_GR) translation with complete localization of all plugin strings
- Translation workflow scripts (`npm run i18n:lang`) for managing translations
- Automatic locale detection with fallback support (el_GR → el)
- Translation files structure (POT, PO, MO) in `languages/` directory
- Enhanced text domain loading with improved locale handling

### Changed
- Improved text domain loading mechanism for better translation support
- Updated plugin structure to support multiple languages

## [1.1.0] - 2026-01-10

### Added
- Letter spacing customization option (supports negative and positive values in pixels)
- Enhanced gutter spacing for better readability of line numbers

### Fixed
- Improved spacing between line numbers and code content in the editor gutter

## [1.0.0] - 2026-01-05

### Added
- Initial release of CodeMirror Forge
- 40+ CodeMirror 5 themes support
- Font customization:
  - Font family selection via Fontsource API
  - Font weight adjustment (100-900)
  - Font size customization (minimum 10px)
  - Line height configuration (multipliers or custom units)
- Display options:
  - Line numbers toggle
  - Word wrap toggle
  - Ruler column for line length guidelines
- Live preview editor with real-time updates
- Sample code preview for JavaScript, PHP, CSS, HTML, and JSON
- Intuitive admin interface
- Universal application to all CodeMirror editors in WordPress
- Dynamic theme loading from CDN

[1.2.0]: https://github.com/mgiannopoulos24/codemirror-forge/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/mgiannopoulos24/codemirror-forge/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/mgiannopoulos24/codemirror-forge/releases/tag/v1.0.0
