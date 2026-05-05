=== CM Forge ===
Contributors: mgiannopoulos24
Tags: codemirror, editor, theme, customize, font
Requires at least: 5.0
Tested up to: 6.9
Stable tag: 1.3.3
Requires PHP: 7.4
License: GPL v3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Forge your perfect CodeMirror editor experience. Customize themes, fonts, and display options for all CodeMirror instances in WordPress.

== Description ==

CM Forge provides powerful customization options for WordPress CodeMirror editors, making it easy to personalize your code editing experience. Instead of using default editor settings, you can customize themes, font sizes, line numbers, and word wrapping across all CodeMirror instances in WordPress.

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

= 1.3.3 =
* Full codebase refactoring to follow WordPress PHP coding standards
* Added proper PHPDoc comments for all classes and methods

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

This plugin relies on third-party services to provide core font and theme customization features. No account is required to use this plugin, and no personal data is collected or transmitted beyond standard HTTP requests for public asset loading. All services are used under the permitted exception for plugins providing a service, as outlined in WordPress plugin guidelines.

1. **Fontsource API (api.fontsource.org/v1)**
   - **Purpose**: Fetches the list of available open-source fonts to populate the font family dropdown in the plugin settings.
   - **Data Sent**: A GET request is made to retrieve font metadata when the plugin admin page loads. No personal data, user information, or site-specific data is sent.
   - **Provider**: Fontsource (https://fontsource.org)
   - **Terms of Service**: https://fontsource.org/terms
   - **Privacy Policy**: https://fontsource.org/privacy

2. **Fontsource CDN (cdn.jsdelivr.net/npm/@fontsource/)**
   - **Purpose**: Loads font stylesheets (including specific weights) when a font is selected in the plugin settings. This enables proper rendering of font weight, size, line height, and letter spacing customizations.
   - **Data Sent**: A GET request for the corresponding font CSS file is made when a user selects a font or changes font weight. No personal data is transmitted.
   - **Provider**: Fontsource via jsDelivr CDN (https://www.jsdelivr.com)
   - **Terms of Service**: https://www.jsdelivr.com/terms
   - **Privacy Policy**: https://www.jsdelivr.com/privacy
   - **License Note**: All fonts hosted on Fontsource are licensed under the Open Font License (OFL) or GPL, which are fully compatible with WordPress plugin guidelines.

3. **CodeMirror CDN (cdn.jsdelivr.net/npm/codemirror@5.65.16/)**
   - **Purpose**: Loads CodeMirror 5 theme CSS files when a theme is selected in the plugin settings.
   - **Data Sent**: A GET request for the corresponding theme CSS file is made when a user selects a theme. No personal data is transmitted.
   - **Provider**: CodeMirror via jsDelivr CDN (https://www.jsdelivr.com)
   - **Terms of Service**: https://www.jsdelivr.com/terms
   - **Privacy Policy**: https://www.jsdelivr.com/privacy
   - **License Note**: CodeMirror 5 is licensed under MIT, which is fully compatible with WordPress plugin guidelines.

== Notes on Remote Asset Loading ==

This plugin loads font and theme assets from public CDNs rather than bundling them locally to:
- Keep the plugin lightweight (avoid bundling hundreds of font files and theme CSS)
- Ensure users have access to the latest font and theme versions
- Comply with GPL compatibility requirements for all assets

All assets are publicly available, require no authentication to access, and no user data is tracked by the service providers.

== Screenshots ==

1. Admin settings page with live preview
2. Theme selection preview
3. Font customization options