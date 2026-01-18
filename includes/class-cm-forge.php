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
        $domain = 'codemirror-forge';
        $locale = apply_filters('plugin_locale', determine_locale(), $domain);
        
        // Use standard WordPress function first - it handles path resolution automatically
        load_plugin_textdomain(
            $domain,
            false,
            dirname(CM_FORGE_PLUGIN_BASENAME) . '/languages'
        );
        
        // Additional manual loading for better compatibility
        $mofile = CM_FORGE_PLUGIN_DIR . 'languages/' . $domain . '-' . $locale . '.mo';
        
        // Try loading with specific locale
        if (file_exists($mofile)) {
            load_textdomain($domain, $mofile);
        }
        
        // If locale doesn't have country code, try common variants
        // e.g., if locale is "el", try "el_GR"
        if (strpos($locale, '_') === false) {
            $common_variants = array(
                'el' => 'el_GR',  // Greek
                'en' => 'en_US',  // English
                'es' => 'es_ES',  // Spanish
                'fr' => 'fr_FR',  // French
                'de' => 'de_DE',  // German
                'it' => 'it_IT',  // Italian
                'pt' => 'pt_PT',  // Portuguese
            );
            
            if (isset($common_variants[$locale])) {
                $variant_locale = $common_variants[$locale];
                $variant_mofile = CM_FORGE_PLUGIN_DIR . 'languages/' . $domain . '-' . $variant_locale . '.mo';
                if (file_exists($variant_mofile)) {
                    load_textdomain($domain, $variant_mofile);
                }
            }
        } else {
            // Fallback: try without country code (e.g., el_GR -> el)
            $locale_fallback = explode('_', $locale)[0];
            $mofile_fallback = CM_FORGE_PLUGIN_DIR . 'languages/' . $domain . '-' . $locale_fallback . '.mo';
            if (file_exists($mofile_fallback)) {
                load_textdomain($domain, $mofile_fallback);
            }
        }
    }
    
}

