=== CodeMirror Forge ===
Contributors: mgiannopoulos24
Tags: codemirror, editor, theme, customize, font
Requires at least: 5.0
Tested up to: 6.9.4
Stable tag: 1.3.2
Requires PHP: 7.4
License: GPL v3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Forge your perfect CodeMirror editor experience. Customize themes, fonts, and display options for all CodeMirror instances in WordPress.

== Description ==

CodeMirror Forge provides powerful customization options for WordPress CodeMirror editors, making it easy to personalize your code editing experience. Instead of using default editor settings, you can customize themes, font sizes, line numbers, and word wrapping across all CodeMirror instances in WordPress.

= Features =

* 40+ Themes - Choose from a wide selection of CodeMirror 5 themes including Monokai, Dracula, Material, Solarized, Nord, GitHub, and many more
* Font Customization - Select from hundreds of fonts, adjust font weight, size, line height, and letter spacing
* Display Options - Toggle line numbers, word wrap, ruler column, and current line highlighting
* Live Preview - Real-time preview editor that updates instantly as you change settings
* Internationalization - Full translation support with Greek (el_GR) included

== Installation ==

1. Upload the `codemirror-forge` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Navigate to Settings > CodeMirror Forge to configure your preferences

== Changelog ==

= 1.3.2 =
* Added nonce verification for improved security

= 1.3.1 =
* Added uninstall.php for proper cleanup when plugin is uninstalled
* Added validation for font weight to only allow values 100-900

= 1.3.0 =
* Added font weight customization
* Added line height with unit support (em, px, etc.)
* Added enhanced gutter spacing option
* Added Greek translation (el_GR)

= 1.2.0 =
* Added letter spacing customization
* Added ruler column feature
* Added current line highlighting

= 1.1.0 =
* Added font size customization
* Added font family selection via Fontsource API

= 1.0.0 =
* Initial release
* Theme customization
* Line numbers toggle
* Word wrap toggle

== Frequently Asked Questions ==

= Does this plugin work with the Gutenberg code block? =
Yes, it applies to all CodeMirror editor instances in WordPress, including the code block in Gutenberg.

= Where are the settings? =
Go to Settings > CodeMirror Forge in your WordPress admin.

= How do I get support? =
For support, please visit the GitHub repository or the WordPress support forums.

== External Services ==

This plugin loads themes from the CodeMirror CDN (cdnjs.cloudflare.com) when selected by the user. No personal data is sent to external services.

== Screenshots ==

1. Admin settings page with live preview
2. Theme selection preview
3. Font customization options