<?php
/**
 * CodeMirror editor modifications
 *
 * @package CM_Forge
 */

if (!defined('ABSPATH')) {
    exit;
}

class CM_Forge_Editor {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_enqueue_scripts', array($this, 'enqueue_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_editor_assets'));
        add_filter('wp_code_editor_settings', array($this, 'modify_code_editor_settings'), 10, 2);
    }

    /**
     * Enqueue editor assets
     */
    public function enqueue_editor_assets() {
        // Only enqueue on pages that use CodeMirror
        if (!$this->should_enqueue_assets()) {
            return;
        }

        $options = get_option('cm_forge_options', array());

        // Enqueue CodeMirror 6 assets
        wp_enqueue_script(
            'cm-forge-editor',
            CM_FORGE_PLUGIN_URL . 'assets/js/editor.js',
            array(),
            CM_FORGE_VERSION,
            true
        );

        wp_enqueue_style(
            'cm-forge-editor',
            CM_FORGE_PLUGIN_URL . 'assets/css/editor.css',
            array(),
            CM_FORGE_VERSION
        );

        // Load font if font family is set
        $font_family = isset($options['font_family']) ? $options['font_family'] : '';
        $font_weight = isset($options['font_weight']) ? $options['font_weight'] : '400';
        if (!empty($font_family)) {
            // Convert font family name to Fontsource format (lowercase, spaces to dashes)
            $font_id = strtolower(str_replace(' ', '-', $font_family));
            
            // Load base font (index.css includes common weights like 400, 700)
            wp_enqueue_style(
                'cm-forge-font-' . $font_id . '-base',
                'https://cdn.jsdelivr.net/npm/@fontsource/' . $font_id . '/index.css',
                array(),
                null
            );
            
            // Load specific weight if it's not a common one (400, 700 are usually in index.css)
            if ($font_weight !== '400' && $font_weight !== '700') {
                wp_enqueue_style(
                    'cm-forge-font-' . $font_id . '-' . $font_weight,
                    'https://cdn.jsdelivr.net/npm/@fontsource/' . $font_id . '/' . $font_weight . '.css',
                    array('cm-forge-font-' . $font_id . '-base'),
                    null
                );
            }
        }

        // Pass settings to JavaScript
        wp_localize_script('cm-forge-editor', 'cmForgeSettings', array(
            'theme' => isset($options['theme']) ? $options['theme'] : 'default',
            'fontFamily' => $font_family,
            'fontWeight' => isset($options['font_weight']) ? $options['font_weight'] : '400',
            'fontSize' => isset($options['font_size']) ? $options['font_size'] : 14,
            'lineHeight' => isset($options['line_height']) ? $options['line_height'] : '1.5',
            'lineNumbers' => isset($options['line_numbers']) ? $options['line_numbers'] : true,
            'wordWrap' => isset($options['word_wrap']) ? $options['word_wrap'] : false,
            'rulerColumn' => isset($options['ruler_column']) ? $options['ruler_column'] : 0,
        ));
    }

    /**
     * Check if assets should be enqueued
     *
     * @return bool
     */
    private function should_enqueue_assets() {
        // Enqueue on admin pages that typically use code editors
        if (is_admin()) {
            $screen = get_current_screen();
            if ($screen && (
                'post' === $screen->base ||
                'theme-editor' === $screen->id ||
                'plugin-editor' === $screen->id ||
                'customize' === $screen->id
            )) {
                return true;
            }
        }

        // Add custom conditions as needed
        return apply_filters('cm_forge_should_enqueue', false);
    }

    /**
     * Modify code editor settings
     *
     * @param array $settings Editor settings
     * @param string $editor_id Editor ID
     * @return array Modified settings
     */
    public function modify_code_editor_settings($settings, $editor_id) {
        $options = get_option('cm_forge_options', array());

        if (isset($options['theme'])) {
            $settings['theme'] = $options['theme'];
        }

        if (isset($options['font_size'])) {
            $settings['fontSize'] = $options['font_size'];
        }

        if (isset($options['line_numbers'])) {
            $settings['lineNumbers'] = $options['line_numbers'];
        }

        if (isset($options['word_wrap'])) {
            $settings['wordWrap'] = $options['word_wrap'];
        }

        return $settings;
    }
}

