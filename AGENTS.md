# Agent Development Guide

This document outlines development guidelines for agents working on CodeMirror Forge.

## Project Overview

A WordPress plugin that customizes CodeMirror editor instances with themes, fonts, and display options. Uses **CodeMirror 5** (not CodeMirror 6).

## Key Files

- `codemirror-forge.php` - Main plugin file
- `includes/class-cm-forge-admin.php` - Admin settings and UI
- `includes/class-cm-forge-editor.php` - Editor asset enqueuing
- `assets/js/editor.js` - Editor customization logic
- `assets/js/admin.js` - Admin preview logic
- `assets/css/editor.css` - Editor styling

## Editor Customization Pattern

When adding new editor settings:

1. **Admin settings** (`class-cm-forge-admin.php`):
   - Register in `register_settings()`
   - Add sanitization in `sanitize_settings()`
   - Add render method

2. **Settings passing** (`class-cm-forge-editor.php`):
   - Add to `wp_localize_script` array

3. **Editor application** (`editor.js`):
   - Add logic in `customizeEditor()`
   - Apply to `.CodeMirror-code`, `.CodeMirror pre`, `.CodeMirror-line`
   - **Exclude gutters**: Never style `.CodeMirror-gutters`, `.CodeMirror-gutter`, `.CodeMirror-linenumber`

4. **Admin preview** (`admin.js`):
   - Add to `settingsInputs` array
   - Add event listeners for real-time updates

## Gutter Rules

- Never apply font-family, font-weight, font-size, letter-spacing, or line-height to gutters
- Explicitly reset gutter styles if needed

## Documentation Requirements

After any code change:

1. **README.md** - Update Features and Usage sections
2. **readme.txt** - Update Features and Changelog sections to match README.md
3. **CHANGELOG.md** - Add entry under appropriate version
   - Follow Keep a Changelog format
   - Use semantic versioning (MAJOR.MINOR.PATCH)

## Version Updates

After CHANGELOG update, update version in:
1. `codemirror-forge.php` (header and constant)
2. `package.json`

## Translation Updates

After adding new translatable strings:
- Run: `bun run i18n:lang <locale> all`
- Requires wp-env running (`bun run start`)
- Never manually edit .pot/.po/.mo files

## Code Style

- PHP: WordPress coding standards, proper sanitization
- JavaScript: Vanilla JS, `'use strict'`, check undefined
- CSS: Use `cm-forge-` prefix, avoid `!important`

## Available Scripts

```bash
bun run start     # Start dev environment
bun run stop      # Stop dev environment
bun run bundle    # Create distribution zip
bun run lint      # PHP syntax check
bun run i18n:lang <locale> all  # Update translations
```