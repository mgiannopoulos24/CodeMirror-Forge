# CodeMirror Forge

A WordPress plugin that expands your CodeMirror editor capabilities. Customize themes, fonts, and display options to forge your perfect editing experience.

## Description

CodeMirror Forge provides powerful customization options for WordPress CodeMirror editors, making it easy to personalize your code editing experience. Instead of using default editor settings, you can customize themes, font sizes, line numbers, and word wrapping across all CodeMirror instances in WordPress.

## Features

- **40+ Themes**: Choose from a wide selection of CodeMirror 5 themes including Monokai, Dracula, Material, Solarized, Nord, GitHub, and many more
- **Font Customization**: 
  - Select from hundreds of fonts via Fontsource API
  - Adjust font weight (100-900)
  - Customize font size (minimum 10px, no maximum)
  - Set line height with multipliers (1.5) or custom units (1.5em, 24px, etc.)
  - Adjust letter spacing in pixels (supports negative and positive values)
- **Display Options**: 
  - Toggle line numbers on/off
  - Enhanced gutter spacing for better readability
  - Enable/disable word wrap
  - Set ruler column for line length guidelines
  - Highlight current line with subtle background color
- **Internationalization (i18n)**: Full translation support with Greek (el_GR) included and ready for additional languages
- **Live Preview**: Real-time preview editor that updates instantly as you change settings
- **Sample Code Preview**: Test your settings with sample JavaScript, PHP, CSS, HTML, and JSON files
- **Easy Settings**: Intuitive admin interface with help icon tooltips for all options
- **Universal Application**: Settings apply to all CodeMirror editors throughout WordPress
- **Dynamic Theme Loading**: Themes are automatically loaded from CDN when selected
- **Lightweight**: Minimal overhead with vanilla JavaScript implementation

## Installation

### WordPress Installation

1. Download the plugin zip file or clone this repository
2. Upload the `codemirror-forge` folder to the `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Navigate to **Settings → CodeMirror Forge** to configure your editor preferences

### Development Setup

This project uses [Bun](https://bun.sh) as the package manager and [@wordpress/env](https://github.com/WordPress/gutenberg/tree/trunk/packages/env) for local WordPress development.

#### Prerequisites

- [Bun](https://bun.sh) installed on your system
- Docker and Docker Compose (required for wp-env)

#### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/mgiannopoulos24/codemirror-forge.git
cd codemirror-forge
```

2. **Install dependencies**
```bash
bun install
```

3. **Start the local WordPress environment**
```bash
bun run start
```
This will start a WordPress instance at `http://localhost:8888`

## Available Scripts

### Development Scripts

- `bun run start` - Start the local WordPress environment using wp-env
- `bun run stop` - Stop the WordPress environment
- `bun run destroy` - Destroy the WordPress environment (removes all data)
- `bun run shell` - Open a bash shell in the WordPress CLI container

### Build Scripts

- `bun run bundle` - Create a distribution zip file (`codemirror-forge.zip`) containing the plugin files
- `bun run lint` - Run PHP linting on all PHP files in the project

### Translation Scripts

- `bun run i18n:lang <locale> all` - Generate POT, update PO, and compile MO for a specific language (e.g., `npm run i18n:lang el_GR all`)
- `bun run i18n:lang <locale> update` - Update PO file from POT template
- `bun run i18n:lang <locale> make-mo` - Compile MO file from PO file

## Usage

1. Navigate to **Settings → CodeMirror Forge** in your WordPress admin
2. Configure your preferences:
   - **Theme**: Select from 40+ available CodeMirror 5 themes (preview updates instantly)
   - **Font Family**: Search and select from hundreds of available fonts
   - **Font Weight**: Choose font weight (100-900)
   - **Font Size**: Set font size in pixels (minimum 10px)
   - **Line Height**: Set line height as multiplier (1.5) or with units (1.5em, 24px, etc.)
   - **Letter Spacing**: Adjust letter spacing in pixels (can be negative or positive, default: 0)
   - **Line Numbers**: Toggle line number display
   - **Word Wrap**: Enable or disable word wrapping
   - **Ruler Column**: Set a column guide for line length (0 to disable)
   - **Highlight Current Line**: Enable highlighting of the line where the cursor is located
3. Use the **Live Preview** section to see your changes in real-time
4. Test different file types (JavaScript, PHP, CSS, HTML, JSON) in the preview
5. Click **Save Settings** to apply your customizations
6. Your settings will automatically apply to all CodeMirror editors in WordPress, including:
   - Theme editor
   - Plugin editor
   - Customizer code editor
   - Post editor code blocks
   - Any other CodeMirror instances

## Project Structure

```
codemirror-forge/
├── assets/           # CSS and JavaScript files
│   ├── css/         # Stylesheets
│   │   ├── admin.css
│   │   └── editor.css
│   ├── js/          # JavaScript files
│   │   ├── admin.js
│   │   └── editor.js
│   └── select2/     # Select2 library files
│       ├── css/
│       └── js/
├── includes/        # PHP class files
│   ├── class-cm-forge.php
│   ├── class-cm-forge-admin.php
│   ├── class-cm-forge-editor.php
│   └── class-cm-forge-autoloader.php
├── views/           # Admin view templates
│   └── admin-settings.php
├── tests/           # Test files
│   └── mocks/       # Sample code files for preview
│       ├── example.js
│       ├── example.php
│       ├── example.css
│       ├── example.html
│       └── example.json
├── languages/       # Translation files
│   ├── codemirror-forge.pot  # Translation template
│   ├── codemirror-forge-el_GR.po  # Greek translations
│   └── codemirror-forge-el_GR.mo  # Compiled Greek translations
├── scripts/        # Utility scripts
│   └── i18n-lang.sh  # Translation management script
├── codemirror-forge.php   # Main plugin file
├── package.json     # Dependencies and scripts
└── .wp-env.json     # WordPress environment configuration
```

## Requirements

- WordPress 5.0 or higher
- PHP 8.3 or higher (for development)
- Bun (for development)

## Development

The plugin uses WordPress's standard plugin structure and follows WordPress coding standards. The local development environment is configured to use:

- WordPress latest version
- PHP 8.3
- Twenty Twenty-Five theme
- Debug mode enabled

## Customization

### Available Themes

The plugin supports all CodeMirror 5 themes, including:
- **Dark Themes**: Monokai, Dracula, Material, Material Darker, Material Ocean, Solarized Dark, Nord, Ambiance, Blackboard, Cobalt, and many more
- **Light Themes**: Solarized Light, GitHub Light, Eclipse, Elegant, IDEA, and more

Themes are automatically loaded from CDN when selected, so no manual installation is required.

### Extending Settings

Add new settings by:
1. Registering the field in `register_settings()` method in `class-cm-forge-admin.php`
2. Adding a render method for the field
3. Applying the setting in `assets/js/editor.js` and `assets/js/admin.js` for preview

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## License

This plugin is licensed under the GPL v2 or later license.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
