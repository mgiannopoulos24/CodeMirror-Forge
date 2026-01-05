<?php
/**
 * Plugin Name: CodeMirror Forge
 * Plugin URI: https://github.com/mgiannopoulos24/codemirror-forge
 * Description: Forge your perfect CodeMirror editor experience. Customize themes, fonts, and display options.
 * Version: 1.0.0
 * Author: Marios Giannopoulos
 * Author URI: https://github.com/mgiannopoulos24
 * License: GPL v3
 * Text Domain: codemirror-forge
 * Domain Path: /languages
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CM_FORGE_VERSION', '1.0.0');
define('CM_FORGE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CM_FORGE_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CM_FORGE_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Autoloader
require_once CM_FORGE_PLUGIN_DIR . 'includes/class-cm-forge-autoloader.php';
CM_Forge_Autoloader::register();

// Initialize the plugin
require_once CM_FORGE_PLUGIN_DIR . 'includes/class-cm-forge.php';

/**
 * Get the main plugin instance
 *
 * @return CM_Forge
 */
function cm_forge() {
    return CM_Forge::get_instance();
}

// Initialize the plugin
cm_forge();

