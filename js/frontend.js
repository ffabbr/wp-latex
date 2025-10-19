(function() {
    'use strict';

    /**
     * Pre-process content to handle WordPress line breaks in LaTeX blocks
     */
    function preprocessLaTeXContent(element) {
        // Find all paragraphs that might contain broken LaTeX
        const paragraphs = element.querySelectorAll('p');
        
        paragraphs.forEach(p => {
            let html = p.innerHTML;
            
            // First pass: Handle display math blocks with <br> tags
            // Match $$<br>...<br>$$ patterns and replace <br> with space
            html = html.replace(/\$\$\s*<br\s*\/?>\s*([\s\S]*?)\s*<br\s*\/?>\s*\$\$/gi, (match, content) => {
                // Remove all <br> tags within this block and replace with newlines
                const cleanContent = content.replace(/<br\s*\/?>/gi, '\n');
                return '$$' + cleanContent + '$$';
            });
            
            // Handle bracket notation display math: \[<br>...<br>\]
            html = html.replace(/\\\[\s*<br\s*\/?>\s*([\s\S]*?)\s*<br\s*\/?>\s*\\\]/gi, (match, content) => {
                const cleanContent = content.replace(/<br\s*\/?>/gi, '\n');
                return '\\[' + cleanContent + '\\]';
            });
            
            // Second pass: Clean up any remaining $$ blocks that might have <br> tags inside
            html = html.replace(/\$\$((?:(?!\$\$)[\s\S])*?)\$\$/g, (match, content) => {
                const cleanContent = content.replace(/<br\s*\/?>/gi, '\n');
                return '$$' + cleanContent + '$$';
            });
            
            // Clean up \[ \] blocks
            html = html.replace(/\\\[((?:(?!\\\])[\s\S])*?)\\\]/g, (match, content) => {
                const cleanContent = content.replace(/<br\s*\/?>/gi, '\n');
                return '\\[' + cleanContent + '\\]';
            });
            
            p.innerHTML = html;
        });
    }

    /**
     * Initialize KaTeX auto-render when DOM is ready
     */
    function initLaTeXRendering() {
        if (typeof renderMathInElement === 'undefined') {
            console.error('KaTeX auto-render library not loaded');
            return;
        }

        // Get the main content area
        const contentElement = document.querySelector('.entry-content') || 
                              document.querySelector('article') || 
                              document.querySelector('main') || 
                              document.body;

        // Pre-process content to fix WordPress line breaks
        preprocessLaTeXContent(contentElement);

        // Configure delimiters for all supported LaTeX notations
        const options = {
            delimiters: [
                // Display mode (centered) - MUST come before inline $
                { left: '$$', right: '$$', display: true },
                { left: '\\[', right: '\\]', display: true },
                // Inline mode - MUST come after display $$
                { left: '\\(', right: '\\)', display: false },
                { left: '$', right: '$', display: false }
            ],
            // Support for multiline and AMS environments
            throwOnError: false,
            errorColor: '#cc0000',
            // Enable trust mode for more LaTeX features
            trust: true,
            // Enable strict mode to catch errors
            strict: false,
            // Macro support
            macros: {
                "\\RR": "\\mathbb{R}",
                "\\NN": "\\mathbb{N}",
                "\\ZZ": "\\mathbb{Z}",
                "\\QQ": "\\mathbb{Q}",
                "\\CC": "\\mathbb{C}"
            }
        };

        // Render LaTeX in the content
        try {
            renderMathInElement(contentElement, options);
            console.log('LaTeX rendering completed successfully');
        } catch (error) {
            console.error('Error rendering LaTeX:', error);
        }
    }

    // Initialize when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLaTeXRendering);
    } else {
        // DOM is already ready, initialize immediately
        initLaTeXRendering();
    }

})();
