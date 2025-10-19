(function(wp) {
    const { registerPlugin } = wp.plugins;
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { PanelRow, ToggleControl } = wp.components;
    const { useSelect, useDispatch } = wp.data;
    const { __ } = wp.i18n;
    const { createElement } = wp.element;

    // Get the meta key from localized data
    const META_KEY = window.latexRendererData.metaKey;

    /**
     * LaTeX Settings Panel Component
     */
    const LaTeXSettingsPanel = () => {
        // Get current meta value
        const meta = useSelect((select) => {
            return select('core/editor').getEditedPostAttribute('meta');
        }, []);

        // Get editPost function
        const { editPost } = useDispatch('core/editor');

        // Get the current value (default to false if not set)
        const value = meta?.[META_KEY] || false;

        return createElement(
            PluginDocumentSettingPanel,
            { 
                name: 'latex-renderer-panel', 
                title: __('LaTeX', 'latex-renderer'), 
                className: 'latex-renderer-panel' 
            },
            createElement(PanelRow, {},
                createElement(ToggleControl, {
                    label: __('Render LaTeX on frontend for this content', 'latex-renderer'),
                    checked: value,
                    onChange: (checked) => {
                        editPost({ 
                            meta: { 
                                ...meta, 
                                [META_KEY]: checked 
                            } 
                        });
                    },
                    help: __('When enabled, KaTeX is loaded on the frontend for this post/page and renders $, \\(...\\), $$, \\[...\\], and AMS environments.', 'latex-renderer')
                })
            )
        );
    };

    // Register the plugin
    registerPlugin('latex-renderer', {
        render: LaTeXSettingsPanel,
        icon: null
    });

})(window.wp);
