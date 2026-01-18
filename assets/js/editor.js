/**
 * CodeMirror Forge Editor Script
 *
 * @package CM_Forge
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Check if settings are available
        if (typeof cmForgeSettings === 'undefined') {
            return;
        }

        // Apply customizations to existing CodeMirror instances
        applyCustomizations();

        // Watch for new CodeMirror instances
        observeCodeMirrorInstances();
    }

    function applyCustomizations() {
        const settings = cmForgeSettings;

        // Find all CodeMirror editors
        const editors = document.querySelectorAll('.CodeMirror, .CodeMirror-wrap');

        editors.forEach(function(editorElement) {
            // Get CodeMirror instance
            const cm = editorElement.CodeMirror || editorElement.cm;
            
            if (cm) {
                customizeEditor(cm, settings);
            }
        });
    }

    /**
     * Load CodeMirror theme CSS dynamically
     * @param {string} themeName - Theme name
     */
    function loadThemeCSS(themeName) {
        // Map our theme names to CodeMirror 5 theme file names
        const themeMap = {
            'dark': 'monokai', 'monokai': 'monokai', 'dracula': 'dracula',
            'material': 'material', 'material-darker': 'material-darker',
            'material-ocean': 'material-ocean', 'material-palenight': 'material-palenight',
            'solarized': 'solarized', 'solarized-dark': 'solarized dark',
            'nord': 'nord', 'github-light': 'github', 'github-dark': 'github',
            'ambiance': 'ambiance', 'base16-dark': 'base16-dark', 'blackboard': 'blackboard',
            'cobalt': 'cobalt', 'erlang-dark': 'erlang-dark', 'hopscotch': 'hopscotch',
            'lesser-dark': 'lesser-dark', 'mbo': 'mbo', 'midnight': 'midnight',
            'neat': 'neat', 'night': 'night', 'oceanic-next': 'oceanic-next',
            'panda-syntax': 'panda-syntax', 'paraiso-dark': 'paraiso-dark',
            'pastel-on-dark': 'pastel-on-dark', 'railscasts': 'railscasts',
            'rubyblue': 'rubyblue', 'seti': 'seti', 'the-matrix': 'the-matrix',
            'tomorrow-night-bright': 'tomorrow-night-bright',
            'tomorrow-night-eighties': 'tomorrow-night-eighties',
            'twilight': 'twilight', 'vibrant-ink': 'vibrant-ink',
            'xq-dark': 'xq-dark', 'yeti': 'yeti', 'zenburn': 'zenburn',
            'base16-light': 'base16-light', 'eclipse': 'eclipse',
            'elegant': 'elegant', 'idea': 'idea', 'md-like': 'md-like', 'xq-light': 'xq-light',
        };

        // Custom themes don't need CSS loading
        if (false) { // No custom themes
            return;
        }

        const cmThemeName = themeMap[themeName] || themeName;
        const themeFileName = cmThemeName.replace(/\s+/g, '-');
        const styleId = 'cm-forge-theme-' + themeFileName;

        // Check if already loaded
        if (document.getElementById(styleId)) {
            return;
        }

        // Load from CDN
        const link = document.createElement('link');
        link.id = styleId;
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/theme/' + themeFileName + '.css';
        link.onerror = function() {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        };
        document.head.appendChild(link);
    }

    function customizeEditor(cm, settings) {
        const editorElement = cm.getWrapperElement();
        
        // Apply theme
        if (settings.theme && settings.theme !== 'default') {
            // Load theme CSS if needed
            loadThemeCSS(settings.theme);
            
            try {
                // CodeMirror 5 built-in themes (these have complete CSS in CodeMirror)
                // Map our theme names to CodeMirror 5 theme names
                const cm5Themes = {
                    // Popular themes
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
                    // Dark themes
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
                    // Light themes
                    'base16-light': 'base16-light',
                    'eclipse': 'eclipse',
                    'elegant': 'elegant',
                    'idea': 'idea',
                    'md-like': 'md-like',
                    'xq-light': 'xq-light',
                };
                
                // Custom themes that don't exist in CodeMirror 5 (need our CSS)
                const customThemes = [];
                
                // Remove all theme classes first (only custom themes use classes)
                const allThemeClasses = [];
                editorElement.classList.remove(...allThemeClasses);
                
                if (cm5Themes[settings.theme]) {
                    // Use CodeMirror 5's built-in theme - it has complete CSS
                    cm.setOption('theme', cm5Themes[settings.theme]);
                    // Don't add CSS classes - CodeMirror handles everything
                } else if (customThemes.includes(settings.theme)) {
                    // Custom theme - use our CSS classes
                    editorElement.classList.add('cm-theme-' + settings.theme);
                }
            } catch (e) {
                // Theme not available, continue with default
            }
        }

        // Apply font family
        if (settings.fontFamily) {
            // Apply to the wrapper and all code elements
            editorElement.style.fontFamily = '"' + settings.fontFamily + '", monospace';
            const codeElements = editorElement.querySelectorAll('.CodeMirror-code, .CodeMirror pre, .CodeMirror-line');
            codeElements.forEach(function(el) {
                el.style.fontFamily = '"' + settings.fontFamily + '", monospace';
            });
        }

        // Apply font weight
        if (settings.fontWeight) {
            editorElement.style.fontWeight = settings.fontWeight;
            const codeElements = editorElement.querySelectorAll('.CodeMirror-code, .CodeMirror pre, .CodeMirror-line');
            codeElements.forEach(function(el) {
                el.style.fontWeight = settings.fontWeight;
            });
        }

        // Apply font size
        if (settings.fontSize) {
            editorElement.style.fontSize = settings.fontSize + 'px';
        }

        // Apply line height (supports both float values and values with units like em, px)
        if (settings.lineHeight) {
            const lineHeightValue = String(settings.lineHeight).trim();
            editorElement.style.lineHeight = lineHeightValue;
            const codeElements = editorElement.querySelectorAll('.CodeMirror-code, .CodeMirror pre, .CodeMirror-line');
            codeElements.forEach(function(el) {
                el.style.lineHeight = lineHeightValue;
            });
        }

        // Apply letter spacing (exclude gutters)
        if (settings.letterSpacing !== undefined && settings.letterSpacing !== null) {
            const letterSpacingValue = settings.letterSpacing + 'px';
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
        if (settings.lineNumbers !== undefined) {
            cm.setOption('lineNumbers', settings.lineNumbers);
        }

        // Apply word wrap
        if (settings.wordWrap !== undefined) {
            cm.setOption('lineWrapping', settings.wordWrap);
        }

        // Apply ruler column
        if (settings.rulerColumn && settings.rulerColumn > 0) {
            try {
                // Create or update ruler element
                let ruler = editorElement.querySelector('.cm-forge-ruler');
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
                
                // Calculate ruler position
                // Approximate character width (CodeMirror 5 uses defaultCharWidth)
                const charWidth = cm.defaultCharWidth ? cm.defaultCharWidth() : 8;
                const rulerPosition = settings.rulerColumn * charWidth;
                ruler.style.left = rulerPosition + 'px';
                ruler.setAttribute('data-column', settings.rulerColumn);
            } catch (e) {
                // Ruler not available
            }
        } else {
            // Remove ruler if disabled
            const ruler = editorElement.querySelector('.cm-forge-ruler');
            if (ruler) {
                ruler.remove();
            }
        }

        // Apply current line highlighting
        if (settings.currentLineHighlight !== undefined) {
            try {
                cm.setOption('styleActiveLine', settings.currentLineHighlight);
            } catch (e) {
                // Current line highlighting not available
            }
        }
    }

    function observeCodeMirrorInstances() {
        // Use MutationObserver to watch for new CodeMirror instances
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const cmElements = node.querySelectorAll ? 
                            node.querySelectorAll('.CodeMirror, .CodeMirror-wrap') : [];
                        
                        if (node.classList && node.classList.contains('CodeMirror')) {
                            cmElements.push(node);
                        }

                        cmElements.forEach(function(editorElement) {
                            const cm = editorElement.CodeMirror || editorElement.cm;
                            if (cm && typeof cmForgeSettings !== 'undefined') {
                                customizeEditor(cm, cmForgeSettings);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Also try to hook into WordPress code editor initialization
    if (typeof wp !== 'undefined' && wp.codeEditor && wp.codeEditor.initialize) {
        const originalInitialize = wp.codeEditor.initialize;
        wp.codeEditor.initialize = function(textarea, settings) {
            const result = originalInitialize.call(this, textarea, settings);
            
            if (result && result.codemirror && typeof cmForgeSettings !== 'undefined') {
                customizeEditor(result.codemirror, cmForgeSettings);
            }
            
            return result;
        };
    }

})();

