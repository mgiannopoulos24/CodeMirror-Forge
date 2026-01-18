<?php
/**
 * Admin functionality
 *
 * @package CM_Forge
 */

if (!defined('ABSPATH')) {
    exit;
}

class CM_Forge_Admin {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            __('CodeMirror Forge', 'codemirror-forge'),
            __('CodeMirror Forge', 'codemirror-forge'),
            'manage_options',
            'codemirror-forge',
            array($this, 'render_settings_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('cm_forge_settings', 'cm_forge_options', array(
            'sanitize_callback' => array($this, 'sanitize_settings'),
            'capability' => 'manage_options',
        ));

        // Theme section
        add_settings_section(
            'cm_forge_theme_section',
            __('Editor Theme', 'codemirror-forge'),
            array($this, 'render_theme_section'),
            'codemirror-forge'
        );

        add_settings_field(
            'theme',
            __('Theme', 'codemirror-forge'),
            array($this, 'render_theme_field'),
            'codemirror-forge',
            'cm_forge_theme_section'
        );

        // Font size section
        add_settings_section(
            'cm_forge_font_section',
            __('Font Settings', 'codemirror-forge'),
            array($this, 'render_font_section'),
            'codemirror-forge'
        );

        add_settings_field(
            'font_family',
            __('Font Family', 'codemirror-forge'),
            array($this, 'render_font_family_field'),
            'codemirror-forge',
            'cm_forge_font_section'
        );

        add_settings_field(
            'font_weight',
            __('Font Weight', 'codemirror-forge'),
            array($this, 'render_font_weight_field'),
            'codemirror-forge',
            'cm_forge_font_section'
        );

        add_settings_field(
            'font_size',
            __('Font Size', 'codemirror-forge'),
            array($this, 'render_font_size_field'),
            'codemirror-forge',
            'cm_forge_font_section'
        );

        add_settings_field(
            'line_height',
            __('Line Height', 'codemirror-forge'),
            array($this, 'render_line_height_field'),
            'codemirror-forge',
            'cm_forge_font_section'
        );

        add_settings_field(
            'letter_spacing',
            __('Letter Spacing', 'codemirror-forge'),
            array($this, 'render_letter_spacing_field'),
            'codemirror-forge',
            'cm_forge_font_section'
        );

        // Line numbers section
        add_settings_section(
            'cm_forge_display_section',
            __('Display Options', 'codemirror-forge'),
            array($this, 'render_display_section'),
            'codemirror-forge'
        );

        add_settings_field(
            'line_numbers',
            __('Show Line Numbers', 'codemirror-forge'),
            array($this, 'render_line_numbers_field'),
            'codemirror-forge',
            'cm_forge_display_section'
        );

        add_settings_field(
            'word_wrap',
            __('Word Wrap', 'codemirror-forge'),
            array($this, 'render_word_wrap_field'),
            'codemirror-forge',
            'cm_forge_display_section'
        );

        add_settings_field(
            'ruler_column',
            __('Ruler Column', 'codemirror-forge'),
            array($this, 'render_ruler_column_field'),
            'codemirror-forge',
            'cm_forge_display_section'
        );

        add_settings_field(
            'current_line_highlight',
            __('Highlight Current Line', 'codemirror-forge'),
            array($this, 'render_current_line_highlight_field'),
            'codemirror-forge',
            'cm_forge_display_section'
        );
    }

    /**
     * Sanitize settings
     *
     * @param array $input Settings input
     * @return array Sanitized settings
     */
    public function sanitize_settings($input) {
        $sanitized = array();

        if (isset($input['theme'])) {
            $sanitized['theme'] = sanitize_text_field($input['theme']);
        }

        if (isset($input['font_family'])) {
            $sanitized['font_family'] = sanitize_text_field($input['font_family']);
        }

        if (isset($input['font_weight'])) {
            $sanitized['font_weight'] = sanitize_text_field($input['font_weight']);
        }

        if (isset($input['font_size'])) {
            $sanitized['font_size'] = absint($input['font_size']);
        }

        if (isset($input['line_height'])) {
            $line_height = trim($input['line_height']);
            // Allow float values (1.5) or values with units (1.5em, 24px, etc.)
            if (preg_match('/^(\d+\.?\d*)\s*(em|px|rem)?$/i', $line_height, $matches)) {
                $sanitized['line_height'] = $line_height;
            } else {
                // Fallback to default if invalid format
                $sanitized['line_height'] = '1.5';
            }
        }

        if (isset($input['letter_spacing'])) {
            $letter_spacing = trim($input['letter_spacing']);
            // Allow integer or float values in pixels
            if (preg_match('/^-?\d+\.?\d*$/', $letter_spacing)) {
                $sanitized['letter_spacing'] = floatval($letter_spacing);
            } else {
                // Fallback to 0 if invalid format
                $sanitized['letter_spacing'] = 0;
            }
        }

        if (isset($input['ruler_column'])) {
            $sanitized['ruler_column'] = absint($input['ruler_column']);
        }

        if (isset($input['line_numbers'])) {
            $sanitized['line_numbers'] = !empty($input['line_numbers']);
        }

        if (isset($input['word_wrap'])) {
            $sanitized['word_wrap'] = !empty($input['word_wrap']);
        }

        if (isset($input['current_line_highlight'])) {
            $sanitized['current_line_highlight'] = !empty($input['current_line_highlight']);
        }

        return $sanitized;
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'codemirror-forge'));
        }

        include CM_FORGE_PLUGIN_DIR . 'views/admin-settings.php';
    }

    /**
     * Render theme section
     */
    public function render_theme_section() {
        echo '<p>' . esc_html__('Choose the theme for the CodeMirror editor.', 'codemirror-forge') . '</p>';
    }

    /**
     * Render theme field
     */
    public function render_theme_field() {
        $options = get_option('cm_forge_options', array());
        $theme = isset($options['theme']) ? $options['theme'] : 'default';
        $themes = array(
            'default' => __('Default', 'codemirror-forge'),
            // Popular Dark Themes
            'dark' => __('Dark (Monokai)', 'codemirror-forge'),
            'monokai' => __('Monokai', 'codemirror-forge'),
            'dracula' => __('Dracula', 'codemirror-forge'),
            'material' => __('Material', 'codemirror-forge'),
            'material-darker' => __('Material Darker', 'codemirror-forge'),
            'material-ocean' => __('Material Ocean', 'codemirror-forge'),
            'material-palenight' => __('Material Palenight', 'codemirror-forge'),
            'solarized-dark' => __('Solarized Dark', 'codemirror-forge'),
            'nord' => __('Nord', 'codemirror-forge'),
            'github-dark' => __('GitHub Dark', 'codemirror-forge'),
            'ambiance' => __('Ambiance', 'codemirror-forge'),
            'base16-dark' => __('Base16 Dark', 'codemirror-forge'),
            'blackboard' => __('Blackboard', 'codemirror-forge'),
            'cobalt' => __('Cobalt', 'codemirror-forge'),
            'erlang-dark' => __('Erlang Dark', 'codemirror-forge'),
            'hopscotch' => __('Hopscotch', 'codemirror-forge'),
            'lesser-dark' => __('Lesser Dark', 'codemirror-forge'),
            'mbo' => __('MBO', 'codemirror-forge'),
            'midnight' => __('Midnight', 'codemirror-forge'),
            'neat' => __('Neat', 'codemirror-forge'),
            'night' => __('Night', 'codemirror-forge'),
            'oceanic-next' => __('Oceanic Next', 'codemirror-forge'),
            'panda-syntax' => __('Panda Syntax', 'codemirror-forge'),
            'paraiso-dark' => __('Paraiso Dark', 'codemirror-forge'),
            'pastel-on-dark' => __('Pastel on Dark', 'codemirror-forge'),
            'railscasts' => __('RailsCasts', 'codemirror-forge'),
            'rubyblue' => __('Ruby Blue', 'codemirror-forge'),
            'seti' => __('Seti', 'codemirror-forge'),
            'the-matrix' => __('The Matrix', 'codemirror-forge'),
            'tomorrow-night-bright' => __('Tomorrow Night Bright', 'codemirror-forge'),
            'tomorrow-night-eighties' => __('Tomorrow Night Eighties', 'codemirror-forge'),
            'twilight' => __('Twilight', 'codemirror-forge'),
            'vibrant-ink' => __('Vibrant Ink', 'codemirror-forge'),
            'xq-dark' => __('XQ Dark', 'codemirror-forge'),
            'yeti' => __('Yeti', 'codemirror-forge'),
            'zenburn' => __('Zenburn', 'codemirror-forge'),
            // Light Themes
            'solarized' => __('Solarized Light', 'codemirror-forge'),
            'github-light' => __('GitHub Light', 'codemirror-forge'),
            'base16-light' => __('Base16 Light', 'codemirror-forge'),
            'eclipse' => __('Eclipse', 'codemirror-forge'),
            'elegant' => __('Elegant', 'codemirror-forge'),
            'idea' => __('IDEA', 'codemirror-forge'),
            'md-like' => __('MD Like', 'codemirror-forge'),
            'xq-light' => __('XQ Light', 'codemirror-forge'),
        );
        ?>
        <select name="cm_forge_options[theme]" id="cm_theme">
            <?php foreach ($themes as $value => $label) : ?>
                <option value="<?php echo esc_attr($value); ?>" <?php selected($theme, $value); ?>>
                    <?php echo esc_html($label); ?>
                </option>
            <?php endforeach; ?>
        </select>
        <?php
    }

    /**
     * Render font section
     */
    public function render_font_section() {
        echo '<p>' . esc_html__('Customize font settings for the editor.', 'codemirror-forge') . '</p>';
    }

    /**
     * Render font family field
     */
    public function render_font_family_field() {
        $options = get_option('cm_forge_options', array());
        $font_family = isset($options['font_family']) ? $options['font_family'] : '';
        ?>
        <select name="cm_forge_options[font_family]" id="cm_font_family" class="cm-forge-font-select" style="min-width: 300px;">
            <option value=""><?php esc_html_e('Default (inherit)', 'codemirror-forge'); ?></option>
            <?php if (!empty($font_family)) : ?>
                <option value="<?php echo esc_attr($font_family); ?>" selected><?php echo esc_html($font_family); ?></option>
            <?php endif; ?>
        </select>
        <?php $this->render_help_icon(__('Select a font family. Fonts are loaded from Fontsource.', 'codemirror-forge')); ?>
        <?php
    }

    /**
     * Render font weight field
     */
    public function render_font_weight_field() {
        $options = get_option('cm_forge_options', array());
        $font_weight = isset($options['font_weight']) ? $options['font_weight'] : '400';
        $weights = array(
            '100' => __('Thin (100)', 'codemirror-forge'),
            '200' => __('Extra Light (200)', 'codemirror-forge'),
            '300' => __('Light (300)', 'codemirror-forge'),
            '400' => __('Normal (400)', 'codemirror-forge'),
            '500' => __('Medium (500)', 'codemirror-forge'),
            '600' => __('Semi Bold (600)', 'codemirror-forge'),
            '700' => __('Bold (700)', 'codemirror-forge'),
            '800' => __('Extra Bold (800)', 'codemirror-forge'),
            '900' => __('Black (900)', 'codemirror-forge'),
        );
        ?>
        <select name="cm_forge_options[font_weight]" id="cm_font_weight">
            <?php foreach ($weights as $value => $label) : ?>
                <option value="<?php echo esc_attr($value); ?>" <?php selected($font_weight, $value); ?>>
                    <?php echo esc_html($label); ?>
                </option>
            <?php endforeach; ?>
        </select>
        <?php $this->render_help_icon(__('Select font weight', 'codemirror-forge')); ?>
        <?php
    }

    /**
     * Render font size field
     */
    public function render_font_size_field() {
        $options = get_option('cm_forge_options', array());
        $font_size = isset($options['font_size']) ? $options['font_size'] : 14;
        ?>
        <input type="number" name="cm_forge_options[font_size]" id="cm_font_size" 
               value="<?php echo esc_attr($font_size); ?>" min="10" step="1">
        <?php $this->render_help_icon(__('Font size in pixels (minimum: 10).', 'codemirror-forge')); ?>
        <?php
    }

    /**
     * Render line height field
     */
    public function render_line_height_field() {
        $options = get_option('cm_forge_options', array());
        $line_height = isset($options['line_height']) ? $options['line_height'] : '1.5';
        ?>
        <input type="text" name="cm_forge_options[line_height]" id="cm_line_height" 
               value="<?php echo esc_attr($line_height); ?>" placeholder="1.5 or 1.5em or 24px">
        <?php $this->render_help_icon(__('Line height as multiplier (1.5) or with unit (1.5em, 24px). Default: 1.5', 'codemirror-forge')); ?>
        <?php
    }

    /**
     * Render letter spacing field
     */
    public function render_letter_spacing_field() {
        $options = get_option('cm_forge_options', array());
        $letter_spacing = isset($options['letter_spacing']) ? $options['letter_spacing'] : 0;
        ?>
        <input type="number" name="cm_forge_options[letter_spacing]" id="cm_letter_spacing" 
               value="<?php echo esc_attr($letter_spacing); ?>" step="0.1" min="-5" max="10">
        <?php $this->render_help_icon(__('Letter spacing in pixels. Can be negative or positive. Default: 0', 'codemirror-forge')); ?>
        <?php
    }

    /**
     * Render display section
     */
    public function render_display_section() {
        echo '<p>' . esc_html__('Configure display options for the editor.', 'codemirror-forge') . '</p>';
    }

    /**
     * Render line numbers field
     */
    public function render_line_numbers_field() {
        $options = get_option('cm_forge_options', array());
        $line_numbers = isset($options['line_numbers']) ? $options['line_numbers'] : true;
        ?>
        <input type="checkbox" name="cm_forge_options[line_numbers]" id="cm_line_numbers" 
               value="1" <?php checked($line_numbers, true); ?>>
        <label for="cm_line_numbers"><?php esc_html_e('Enable line numbers', 'codemirror-forge'); ?></label>
        <?php
    }

    /**
     * Render word wrap field
     */
    public function render_word_wrap_field() {
        $options = get_option('cm_forge_options', array());
        $word_wrap = isset($options['word_wrap']) ? $options['word_wrap'] : false;
        ?>
        <input type="checkbox" name="cm_forge_options[word_wrap]" id="cm_word_wrap" 
               value="1" <?php checked($word_wrap, true); ?>>
        <label for="cm_word_wrap"><?php esc_html_e('Enable word wrap', 'codemirror-forge'); ?></label>
        <?php
    }

    /**
     * Render ruler column field
     */
    public function render_ruler_column_field() {
        $options = get_option('cm_forge_options', array());
        $ruler_column = isset($options['ruler_column']) ? $options['ruler_column'] : 0;
        ?>
        <input type="number" name="cm_forge_options[ruler_column]" id="cm_ruler_column" 
               value="<?php echo esc_attr($ruler_column); ?>" min="0" max="200" step="1">
        <?php $this->render_help_icon(__('Show ruler at column (0 to disable). Useful for line length guidelines.', 'codemirror-forge')); ?>
        <?php
    }

    /**
     * Render current line highlight field
     */
    public function render_current_line_highlight_field() {
        $options = get_option('cm_forge_options', array());
        $current_line_highlight = isset($options['current_line_highlight']) ? $options['current_line_highlight'] : false;
        ?>
        <input type="checkbox" name="cm_forge_options[current_line_highlight]" id="cm_current_line_highlight" 
               value="1" <?php checked($current_line_highlight, true); ?>>
        <label for="cm_current_line_highlight"><?php esc_html_e('Enable current line highlighting.', 'codemirror-forge'); ?></label>
        <?php $this->render_help_icon(__('Highlight the line where the cursor is located with a subtle background color.', 'codemirror-forge')); ?>
        <?php
    }

    /**
     * Render help icon with tooltip
     *
     * @param string $text Help text to display in tooltip
     */
    private function render_help_icon($text) {
        ?>
        <span class="cm-forge-help-icon" data-tooltip="<?php echo esc_attr($text); ?>" aria-label="<?php echo esc_attr($text); ?>">
            <span class="cm-forge-help-icon-inner">?</span>
        </span>
        <?php
    }

    /**
     * Enqueue admin assets
     *
     * @param string $hook Current admin page hook
     */
    public function enqueue_admin_assets($hook) {
        if ('settings_page_codemirror-forge' !== $hook) {
            return;
        }

        wp_enqueue_style(
            'cm-forge-admin',
            CM_FORGE_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            CM_FORGE_VERSION
        );

        // Enqueue editor CSS for theme styles in preview
        wp_enqueue_style(
            'cm-forge-editor',
            CM_FORGE_PLUGIN_URL . 'assets/css/editor.css',
            array(),
            CM_FORGE_VERSION
        );

        // Enqueue Select2
        wp_enqueue_style(
            'select2',
            CM_FORGE_PLUGIN_URL . 'assets/select2/css/select2.min.css',
            array(),
            '4.1.0'
        );

        wp_enqueue_script(
            'select2',
            CM_FORGE_PLUGIN_URL . 'assets/select2/js/select2.min.js',
            array('jquery'),
            '4.1.0',
            true
        );

        // Enqueue WordPress code editor (CodeMirror)
        wp_enqueue_code_editor(array('type' => 'text/javascript'));

        $options = get_option('cm_forge_options', array());
        
        wp_enqueue_script(
            'cm-forge-admin',
            CM_FORGE_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery', 'select2', 'wp-codemirror'),
            CM_FORGE_VERSION,
            true
        );

        // Load sample files for preview
        $sample_files = array();
        $file_types = array('php', 'js', 'css', 'html', 'json');
        
        foreach ($file_types as $type) {
            $file_path = CM_FORGE_PLUGIN_DIR . 'tests/mocks/example.' . $type;
            if (file_exists($file_path)) {
                $sample_files[$type] = file_get_contents($file_path);
            }
        }

        // Pass current settings to JavaScript
        wp_localize_script('cm-forge-admin', 'cmForgeAdminSettings', array(
            'theme' => isset($options['theme']) ? $options['theme'] : 'default',
            'fontFamily' => isset($options['font_family']) ? $options['font_family'] : '',
            'fontWeight' => isset($options['font_weight']) ? $options['font_weight'] : '400',
            'fontSize' => isset($options['font_size']) ? $options['font_size'] : 14,
            'lineHeight' => isset($options['line_height']) ? $options['line_height'] : '1.5',
            'lineNumbers' => isset($options['line_numbers']) ? $options['line_numbers'] : true,
            'wordWrap' => isset($options['word_wrap']) ? $options['word_wrap'] : false,
            'rulerColumn' => isset($options['ruler_column']) ? $options['ruler_column'] : 0,
            'currentLineHighlight' => isset($options['current_line_highlight']) ? $options['current_line_highlight'] : false,
            'pluginUrl' => CM_FORGE_PLUGIN_URL,
            'sampleFiles' => $sample_files,
        ));
    }
}

