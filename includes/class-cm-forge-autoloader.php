<?php
/**
 * Autoloader for CodeMirror Forge plugin
 *
 * @package CM_Forge
 */

if (!defined('ABSPATH')) {
    exit;
}

class CM_Forge_Autoloader {

    /**
     * Register autoloader
     */
    public static function register() {
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }

    /**
     * Autoload classes
     *
     * @param string $class_name Class name to load
     */
    public static function autoload($class_name) {
        // Only load our classes
        if (strpos($class_name, 'CM_Forge') !== 0) {
            return;
        }

        // Convert class name to file name
        $file_name = str_replace('CM_Forge_', '', $class_name);
        $file_name = str_replace('_', '-', $file_name);
        $file_name = strtolower($file_name);
        $file_path = CM_FORGE_PLUGIN_DIR . 'includes/class-' . $file_name . '.php';

        if (file_exists($file_path)) {
            require_once $file_path;
        }
    }
}

