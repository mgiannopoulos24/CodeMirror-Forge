/**
 * CodeMirror Forge Admin Script
 *
 * @package CM_Forge
 */

(function() {
    'use strict';

    let previewEditor = null;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const fontFamilySelect = document.getElementById('cm_font_family');
        const fontWeightSelect = document.getElementById('cm_font_weight');
        const themeSelect = document.getElementById('cm_theme');
        
        if (!fontFamilySelect) {
            return;
        }

        // Initialize CodeMirror preview
        initPreviewEditor();

        // Initialize Select2 on theme dropdown
        if (themeSelect && typeof jQuery !== 'undefined' && jQuery.fn.select2) {
            jQuery(themeSelect).select2({
                placeholder: 'Select a theme...',
                allowClear: false,
                width: '200px',
                minimumInputLength: 0,
            });

            // Load theme CSS when selection changes and update preview immediately
            jQuery(themeSelect).on('select2:select', function() {
                const selectedTheme = this.value;
                if (selectedTheme && selectedTheme !== 'default') {
                    // Load CSS and update preview when it's loaded
                    loadThemeCSS(selectedTheme, function() {
                        updatePreviewEditor();
                    });
                } else {
                    // Theme is default, update immediately
                    updatePreviewEditor();
                }
            });
        }

        // Load initial theme CSS if one is selected
        if (themeSelect && themeSelect.value && themeSelect.value !== 'default') {
            loadThemeCSS(themeSelect.value);
        }

        // Setup file type selector for preview
        const fileTypeSelect = document.getElementById('cm-forge-preview-file-type');
        if (fileTypeSelect) {
            fileTypeSelect.addEventListener('change', function() {
                loadPreviewFile(this.value);
            });
        }

        // Initialize Select2 on font family select
        if (typeof jQuery !== 'undefined' && jQuery.fn.select2) {
            jQuery(fontFamilySelect).select2({
                placeholder: 'Search and select a font...',
                allowClear: true,
                width: '200px',
                minimumInputLength: 0,
                language: {
                    noResults: function() {
                        return 'No fonts found';
                    },
                    searching: function() {
                        return 'Searching...';
                    }
                }
            });

            // Load font preview when selection changes
            jQuery(fontFamilySelect).on('select2:select select2:clear', function() {
                const selectedFont = this.value;
                const selectedWeight = fontWeightSelect ? fontWeightSelect.value : '400';
                if (selectedFont) {
                    loadFontPreview(selectedFont, selectedWeight);
                }
            });
        } else {
            // Fallback if Select2 is not loaded
            fontFamilySelect.addEventListener('change', function() {
                const selectedFont = this.value;
                const selectedWeight = fontWeightSelect ? fontWeightSelect.value : '400';
                if (selectedFont) {
                    loadFontPreview(selectedFont, selectedWeight);
                }
            });
        }

        // Always fetch fonts from Fontsource API to populate the full list
        // The saved value will be preserved during the fetch
        fetchFonts(fontFamilySelect);

        // Update preview when font weight changes
        if (fontWeightSelect) {
            fontWeightSelect.addEventListener('change', function() {
                const selectedFont = fontFamilySelect.value;
                const selectedWeight = this.value;
                if (selectedFont) {
                    loadFontPreview(selectedFont, selectedWeight);
                }
            });
        }

        // Load initial preview if font is already selected
        const selectedFont = fontFamilySelect.value;
        const selectedWeight = fontWeightSelect ? fontWeightSelect.value : '400';
        if (selectedFont) {
            loadFontPreview(selectedFont, selectedWeight);
        }

        // Initialize help icon tooltips
        initHelpIcons();

        // Update preview editor when any setting changes
        const settingsInputs = [
            fontFamilySelect,
            fontWeightSelect,
            document.getElementById('cm_font_size'),
            document.getElementById('cm_line_height'),
            document.getElementById('cm_letter_spacing'),
            document.getElementById('cm_theme'),
            document.getElementById('cm_line_numbers'),
            document.getElementById('cm_word_wrap'),
            document.getElementById('cm_ruler_column'),
            document.getElementById('cm_current_line_highlight')
        ];

        settingsInputs.forEach(function(input) {
            if (input) {
                input.addEventListener('change', updatePreviewEditor);
                // Add input event for number inputs and text inputs (like line height)
                if (input.type === 'number' || input.id === 'cm_line_height') {
                    input.addEventListener('input', updatePreviewEditor);
                }
            }
        });
    }

    function initPreviewEditor() {
        const previewTextarea = document.getElementById('cm-forge-preview-editor');
        if (!previewTextarea) {
            return;
        }

        // Wait for WordPress code editor to be available
        if (typeof wp === 'undefined' || !wp.codeEditor) {
            // Retry after a short delay
            setTimeout(initPreviewEditor, 100);
            return;
        }

        // Get initial mode from data attribute or default to javascript
        const initialMode = previewTextarea.getAttribute('data-mode') || 'javascript';

        // Initialize CodeMirror using WordPress's code editor
        const editorSettings = {
            codemirror: {
                mode: initialMode,
                lineNumbers: true,
                lineWrapping: false,
            }
        };

        try {
            const editor = wp.codeEditor.initialize(previewTextarea, editorSettings);
            if (editor && editor.codemirror) {
                previewEditor = editor.codemirror;
                // Small delay to ensure CodeMirror is fully initialized
                setTimeout(function() {
                    updatePreviewEditor();
                }, 100);
            }
        } catch (e) {
            // Silently fail if preview editor cannot be initialized
        }
    }

    function loadPreviewFile(fileType) {
        if (!previewEditor) {
            return;
        }

        // Map dropdown values to file extensions and CodeMirror modes
        const fileMap = {
            'javascript': { ext: 'js', mode: 'javascript' },
            'php': { ext: 'php', mode: 'php' },
            'css': { ext: 'css', mode: 'css' },
            'html': { ext: 'html', mode: 'htmlmixed' },
            'json': { ext: 'json', mode: 'application/json' }
        };

        const fileInfo = fileMap[fileType] || fileMap.javascript;
        const mode = fileInfo.mode;

        // Get content from localized script or use default
        let content = '';
        if (typeof cmForgeAdminSettings !== 'undefined' && 
            cmForgeAdminSettings.sampleFiles && 
            cmForgeAdminSettings.sampleFiles[fileInfo.ext]) {
            content = cmForgeAdminSettings.sampleFiles[fileInfo.ext];
        } else {
            content = getDefaultContent(fileType);
        }

        // Update editor content
        previewEditor.setValue(content);
        
        // Update editor mode
        previewEditor.setOption('mode', mode);
        
        // Refresh the editor
        previewEditor.refresh();
        
        // Update preview with current settings
        updatePreviewEditor();
    }

    function getDefaultContent(fileType) {
        const defaults = {
            'javascript': '// JavaScript example\nfunction example() {\n    return true;\n}',
            'php': '<?php\n// PHP example\nfunction example() {\n    return true;\n}',
            'css': '/* CSS example */\n.example {\n    color: #333;\n}',
            'html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>Example</title>\n</head>\n</html>',
            'json': '{\n    "example": true\n}'
        };
        return defaults[fileType] || defaults.javascript;
    }

    /**
     * Load CodeMirror theme CSS dynamically
     * @param {string} themeName - Theme name (e.g., 'monokai', 'dracula')
     * @param {function} callback - Optional callback when CSS is loaded
     */
    function loadThemeCSS(themeName, callback) {
        // Map our theme names to CodeMirror 5 theme file names
        const themeMap = {
            'dark': 'monokai',
            'monokai': 'monokai',
            'dracula': 'dracula',
            'material': 'material',
            'material-darker': 'material-darker',
            'material-ocean': 'material-ocean',
            'material-palenight': 'material-palenight',
            'solarized': 'solarized',
            'solarized-dark': 'solarized dark',
            'nord': 'nord',
            'github-light': 'github',
            'github-dark': 'github',
            'ambiance': 'ambiance',
            'base16-dark': 'base16-dark',
            'blackboard': 'blackboard',
            'cobalt': 'cobalt',
            'erlang-dark': 'erlang-dark',
            'hopscotch': 'hopscotch',
            'lesser-dark': 'lesser-dark',
            'mbo': 'mbo',
            'midnight': 'midnight',
            'neat': 'neat',
            'night': 'night',
            'oceanic-next': 'oceanic-next',
            'panda-syntax': 'panda-syntax',
            'paraiso-dark': 'paraiso-dark',
            'pastel-on-dark': 'pastel-on-dark',
            'railscasts': 'railscasts',
            'rubyblue': 'rubyblue',
            'seti': 'seti',
            'the-matrix': 'the-matrix',
            'tomorrow-night-bright': 'tomorrow-night-bright',
            'tomorrow-night-eighties': 'tomorrow-night-eighties',
            'twilight': 'twilight',
            'vibrant-ink': 'vibrant-ink',
            'xq-dark': 'xq-dark',
            'yeti': 'yeti',
            'zenburn': 'zenburn',
            'base16-light': 'base16-light',
            'eclipse': 'eclipse',
            'elegant': 'elegant',
            'idea': 'idea',
            'md-like': 'md-like',
            'xq-light': 'xq-light',
        };

        // Custom themes don't need CSS loading (they use our CSS)
        const customThemes = [];
        if (customThemes.includes(themeName)) {
            // No CSS to load, call callback immediately
            if (callback && typeof callback === 'function') {
                callback();
            }
            return;
        }

        // Get the actual CodeMirror theme name
        const cmThemeName = themeMap[themeName] || themeName;
        
        // Handle themes with spaces (e.g., 'solarized dark')
        const themeFileName = cmThemeName.replace(/\s+/g, '-');
        const styleId = 'cm-forge-theme-' + themeFileName;

        // Check if CSS is already loaded
        if (document.getElementById(styleId)) {
            // CSS already loaded, call callback immediately
            if (callback && typeof callback === 'function') {
                callback();
            }
            return;
        }

        // Try to load from WordPress's CodeMirror first (if available)
        // Then fallback to CDN
        const cdnUrl = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/theme/' + themeFileName + '.css';
        
        // Create link element
        const link = document.createElement('link');
        link.id = styleId;
        link.rel = 'stylesheet';
        link.href = cdnUrl;
        link.onload = function() {
            // CSS loaded successfully
            if (callback && typeof callback === 'function') {
                callback();
            }
        };
        link.onerror = function() {
            // Remove the failed link
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            // Still call callback even on error
            if (callback && typeof callback === 'function') {
                callback();
            }
        };

        // Add to head
        document.head.appendChild(link);
    }

    function updatePreviewEditor() {
        if (!previewEditor) {
            return;
        }

        // Get current settings
        const settings = typeof cmForgeAdminSettings !== 'undefined' ? cmForgeAdminSettings : {};
        const theme = document.getElementById('cm_theme') ? document.getElementById('cm_theme').value : (settings.theme || 'default');
        const fontFamily = document.getElementById('cm_font_family') ? document.getElementById('cm_font_family').value : (settings.fontFamily || '');
        const fontWeight = document.getElementById('cm_font_weight') ? document.getElementById('cm_font_weight').value : (settings.fontWeight || '400');
        const fontSize = document.getElementById('cm_font_size') ? parseInt(document.getElementById('cm_font_size').value) : (settings.fontSize || 14);
        const lineHeight = document.getElementById('cm_line_height') ? document.getElementById('cm_line_height').value.trim() : (settings.lineHeight || '1.5');
        const letterSpacing = document.getElementById('cm_letter_spacing') ? parseFloat(document.getElementById('cm_letter_spacing').value) : (settings.letterSpacing !== undefined ? settings.letterSpacing : 0);
        const lineNumbers = document.getElementById('cm_line_numbers') ? document.getElementById('cm_line_numbers').checked : (settings.lineNumbers !== false);
        const wordWrap = document.getElementById('cm_word_wrap') ? document.getElementById('cm_word_wrap').checked : (settings.wordWrap || false);
        const rulerColumn = document.getElementById('cm_ruler_column') ? parseInt(document.getElementById('cm_ruler_column').value) : (settings.rulerColumn || 0);
        const currentLineHighlight = document.getElementById('cm_current_line_highlight') ? document.getElementById('cm_current_line_highlight').checked : (settings.currentLineHighlight || false);

        // Apply theme
        const editorElement = previewEditor.getWrapperElement();
        const codeMirrorElement = editorElement.querySelector('.CodeMirror') || editorElement;
        // Only custom themes use CSS classes, CodeMirror 5 themes don't need them
        const allThemeClasses = [];
        
        // Remove all theme classes from both wrapper and CodeMirror element
        editorElement.classList.remove(...allThemeClasses);
        codeMirrorElement.classList.remove(...allThemeClasses);
        
        if (theme && theme !== 'default') {
            // Load theme CSS if needed
            loadThemeCSS(theme);

            // CodeMirror 5 built-in themes mapping
            const cm5Themes = {
                'dark': 'monokai',
                'monokai': 'monokai',
                'dracula': 'dracula',
                'material': 'material',
                'material-darker': 'material-darker',
                'material-ocean': 'material-ocean',
                'material-palenight': 'material-palenight',
                'solarized': 'solarized',
                'solarized-dark': 'solarized dark',
                'nord': 'nord',
                'github-light': 'github',
                'github-dark': 'github',
                'ambiance': 'ambiance',
                'base16-dark': 'base16-dark',
                'blackboard': 'blackboard',
                'cobalt': 'cobalt',
                'erlang-dark': 'erlang-dark',
                'hopscotch': 'hopscotch',
                'lesser-dark': 'lesser-dark',
                'mbo': 'mbo',
                'midnight': 'midnight',
                'neat': 'neat',
                'night': 'night',
                'oceanic-next': 'oceanic-next',
                'panda-syntax': 'panda-syntax',
                'paraiso-dark': 'paraiso-dark',
                'pastel-on-dark': 'pastel-on-dark',
                'railscasts': 'railscasts',
                'rubyblue': 'rubyblue',
                'seti': 'seti',
                'the-matrix': 'the-matrix',
                'tomorrow-night-bright': 'tomorrow-night-bright',
                'tomorrow-night-eighties': 'tomorrow-night-eighties',
                'twilight': 'twilight',
                'vibrant-ink': 'vibrant-ink',
                'xq-dark': 'xq-dark',
                'yeti': 'yeti',
                'zenburn': 'zenburn',
                'base16-light': 'base16-light',
                'eclipse': 'eclipse',
                'elegant': 'elegant',
                'idea': 'idea',
                'md-like': 'md-like',
                'xq-light': 'xq-light',
            };
            
            // Custom themes that need our CSS
            const customThemes = [];
            
            // Load theme CSS if needed
            if (theme && theme !== 'default') {
                loadThemeCSS(theme);
            }

            // Try to apply CodeMirror 5 theme if available
            if (cm5Themes[theme]) {
                try {
                    previewEditor.setOption('theme', cm5Themes[theme]);
                    // CodeMirror 5 themes have complete CSS - don't add our classes
                } catch (e) {
                    // Theme not available, continue with default
                }
            } else if (customThemes.includes(theme)) {
                // Custom theme - use our CSS classes
                const themeClass = 'cm-theme-' + theme;
                editorElement.classList.add(themeClass);
                codeMirrorElement.classList.add(themeClass);
            }
        } else {
            // Reset to default
            try {
                previewEditor.setOption('theme', 'default');
            } catch (e) {
                // Ignore if default theme doesn't exist
            }
        }

        // Apply font family
        if (fontFamily) {
            editorElement.style.fontFamily = '"' + fontFamily + '", monospace';
            const codeElements = editorElement.querySelectorAll('.CodeMirror-code, .CodeMirror pre, .CodeMirror-line');
            codeElements.forEach(function(el) {
                el.style.fontFamily = '"' + fontFamily + '", monospace';
            });
        } else {
            editorElement.style.fontFamily = '';
        }

        // Apply font weight
        if (fontWeight) {
            editorElement.style.fontWeight = fontWeight;
            const codeElements = editorElement.querySelectorAll('.CodeMirror-code, .CodeMirror pre, .CodeMirror-line');
            codeElements.forEach(function(el) {
                el.style.fontWeight = fontWeight;
            });
        }

        // Apply font size
        if (fontSize) {
            editorElement.style.fontSize = fontSize + 'px';
        }

        // Apply line height (supports both float values and values with units like em, px)
        if (lineHeight) {
            const lineHeightValue = lineHeight.trim();
            editorElement.style.lineHeight = lineHeightValue;
            const codeElements = editorElement.querySelectorAll('.CodeMirror-code, .CodeMirror pre, .CodeMirror-line');
            codeElements.forEach(function(el) {
                el.style.lineHeight = lineHeightValue;
            });
        }

        // Apply letter spacing (exclude gutters)
        if (letterSpacing !== undefined && letterSpacing !== null) {
            const letterSpacingValue = letterSpacing + 'px';
            // Don't apply to editorElement to avoid affecting gutters
            const codeElements = editorElement.querySelectorAll('.CodeMirror-code, .CodeMirror pre, .CodeMirror-line');
            codeElements.forEach(function(el) {
                el.style.letterSpacing = letterSpacingValue;
            });
            // Explicitly reset letter spacing for gutters
            const gutterElements = editorElement.querySelectorAll('.CodeMirror-gutters, .CodeMirror-gutter, .CodeMirror-linenumber');
            gutterElements.forEach(function(el) {
                el.style.letterSpacing = '0';
            });
        }

        // Apply line numbers
        previewEditor.setOption('lineNumbers', lineNumbers);

        // Apply word wrap
        previewEditor.setOption('lineWrapping', wordWrap);

        // Apply ruler column
        let ruler = editorElement.querySelector('.cm-forge-ruler');
        if (rulerColumn > 0) {
            if (!ruler) {
                ruler = document.createElement('div');
                ruler.className = 'cm-forge-ruler';
                ruler.style.cssText = 'position: absolute; top: 0; bottom: 0; width: 1px; ' +
                    'background: rgba(128, 128, 128, 0.3); pointer-events: none; z-index: 10;';
                const linesElement = editorElement.querySelector('.CodeMirror-lines');
                if (linesElement) {
                    linesElement.style.position = 'relative';
                    linesElement.appendChild(ruler);
                }
            }
            const charWidth = previewEditor.defaultCharWidth ? previewEditor.defaultCharWidth() : 8;
            const rulerPosition = rulerColumn * charWidth;
            ruler.style.left = rulerPosition + 'px';
            ruler.setAttribute('data-column', rulerColumn);
        } else if (ruler) {
            ruler.remove();
        }

        // Apply current line highlighting
        if (currentLineHighlight !== undefined) {
            try {
                previewEditor.setOption('styleActiveLine', currentLineHighlight);
            } catch (e) {
                // Current line highlighting not available
            }
        }
    }

    function fetchFonts(select) {
        fetch('https://api.fontsource.org/v1/fonts')
            .then(response => response.json())
            .then(data => {
                // Sort fonts alphabetically
                data.sort((a, b) => a.family.localeCompare(b.family));

                // Get saved value
                const savedValue = select.value;

                // Clear existing options except the first one (default)
                while (select.options.length > 1) {
                    select.remove(1);
                }

                // Add all fonts as options
                data.forEach(font => {
                    const option = document.createElement('option');
                    option.value = font.family;
                    option.textContent = font.family;
                    if (font.family === savedValue) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });

                // If Select2 is initialized, trigger update
                if (typeof jQuery !== 'undefined' && jQuery.fn.select2 && jQuery(select).hasClass('select2-hidden-accessible')) {
                    jQuery(select).trigger('change.select2');
                }

                // If saved value exists, load its preview
                if (savedValue) {
                    const fontWeightSelect = document.getElementById('cm_font_weight');
                    const selectedWeight = fontWeightSelect ? fontWeightSelect.value : '400';
                    loadFontPreview(savedValue, selectedWeight);
                }
            })
            .catch(err => {
                const errorOption = document.createElement('option');
                errorOption.value = '';
                errorOption.textContent = 'Error loading fonts';
                select.appendChild(errorOption);
            });
    }

    function loadFontPreview(fontFamily, fontWeight) {
        if (!fontFamily) {
            return;
        }

        fontWeight = fontWeight || '400';

        // Convert font family name to Fontsource format (lowercase, spaces to dashes)
        const fontId = fontFamily.toLowerCase().replace(/\s+/g, '-');

        // Remove existing font links
        const existingLinks = document.querySelectorAll('[id^="cm-forge-font-preview"]');
        existingLinks.forEach(link => link.remove());

        // Load base font (index.css includes common weights)
        const baseLink = document.createElement('link');
        baseLink.id = 'cm-forge-font-preview-base';
        baseLink.rel = 'stylesheet';
        baseLink.href = 'https://cdn.jsdelivr.net/npm/@fontsource/' + fontId + '/index.css';
        baseLink.onerror = function() {
            // Font failed to load, continue without it
        };
        document.head.appendChild(baseLink);

        // Try to load specific weight if it's not a common one (400, 700 are usually in index.css)
        // For other weights, try loading the specific file
        if (fontWeight !== '400' && fontWeight !== '700') {
            const weightLink = document.createElement('link');
            weightLink.id = 'cm-forge-font-preview-weight';
            weightLink.rel = 'stylesheet';
            weightLink.href = 'https://cdn.jsdelivr.net/npm/@fontsource/' + fontId + '/' + fontWeight + '.css';
            weightLink.onerror = function() {
                // If specific weight fails, the base font will handle it via font-synthesis
            };
            document.head.appendChild(weightLink);
        }

        // Apply preview to a preview element if it exists
        const previewElement = document.querySelector('.cm-forge-preview');
        if (previewElement) {
            previewElement.style.fontFamily = '"' + fontFamily + '", monospace';
            previewElement.style.fontWeight = fontWeight;
            // Enable font synthesis for weights that might not be available
            previewElement.style.fontSynthesis = 'weight';
        }

        // Update preview editor if it exists
        if (previewEditor) {
            updatePreviewEditor();
        }
    }

    function initHelpIcons() {
        const helpIcons = document.querySelectorAll('.cm-forge-help-icon');
        
        helpIcons.forEach(function(icon) {
            const tooltipText = icon.getAttribute('data-tooltip');
            if (!tooltipText) {
                return;
            }

            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'cm-forge-tooltip';
            tooltip.textContent = tooltipText;
            icon.appendChild(tooltip);

            // Handle keyboard accessibility
            icon.setAttribute('tabindex', '0');
            icon.setAttribute('role', 'button');
            icon.setAttribute('aria-label', tooltipText);
        });
    }
})();

