<?php
/**
 * Main plugin class
 *
 * @package CM_Forge
 */

if (!defined('ABSPATH')) {
    exit;
}

class CM_Forge {

    /**
     * Plugin instance
     *
     * @var CM_Forge
     */
    private static $instance = null;

    /**
     * Admin instance
     *
     * @var CM_Forge_Admin
     */
    public $admin;

    /**
     * Editor instance
     *
     * @var CM_Forge_Editor
     */
    public $editor;

    /**
     * Get plugin instance
     *
     * @return CM_Forge
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->init();
    }

    /**
     * Initialize plugin
     */
    private function init() {
        // Load text domain
        add_action('plugins_loaded', array($this, 'load_textdomain'));

        // Initialize admin
        if (is_admin()) {
            require_once CM_FORGE_PLUGIN_DIR . 'includes/class-cm-forge-admin.php';
            $this->admin = new CM_Forge_Admin();
        }

        // Initialize editor modifications
        require_once CM_FORGE_PLUGIN_DIR . 'includes/class-cm-forge-editor.php';
        $this->editor = new CM_Forge_Editor();
    }

    /**
     * Load plugin text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'codemirror-forge',
            false,
            dirname(CM_FORGE_PLUGIN_BASENAME) . '/languages'
        );
    }
}

