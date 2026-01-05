<?php
/**
 * Admin settings page template
 *
 * @package CM_Forge
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <form action="options.php" method="post">
        <?php
        settings_fields('cm_forge_settings');
        do_settings_sections('codemirror-forge');
        submit_button(__('Save Settings', 'codemirror-forge'));
        ?>
    </form>

    <div class="cm-forge-preview">
        <h2><?php esc_html_e('Preview', 'codemirror-forge'); ?></h2>
        <p class="description">
            <?php esc_html_e('Preview your CodeMirror editor settings. Changes will be applied to all CodeMirror editors in WordPress.', 'codemirror-forge'); ?>
        </p>
        <div class="cm-forge-preview-controls">
            <label for="cm-forge-preview-file-type">
                <?php esc_html_e('Preview File Type:', 'codemirror-forge'); ?>
            </label>
            <select id="cm-forge-preview-file-type" class="cm-forge-preview-select">
                <option value="javascript">JavaScript</option>
                <option value="php">PHP</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
            </select>
        </div>
        <textarea id="cm-forge-preview-editor" class="cm-forge-preview-textarea" data-mode="javascript"><?php echo file_get_contents(CM_FORGE_PLUGIN_DIR . 'tests/mocks/example.js'); ?>
        </textarea>
    </div>
</div>

