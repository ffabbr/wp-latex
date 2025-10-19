<?php
/**
 * Plugin Name: LaTeX Renderer
 * Plugin URI: https://example.com/latex-renderer
 * Description: Adds a setting to every page and post to enable LaTeX rendering using KaTeX on the frontend. Supports inline ($...$, \(...\)) and display ($$...$$, \[...\]) math notations.
 * Version: 1.0.0
 * Author: Fabian Rohlik
 * Author URI: #
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: latex-renderer
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('LATEX_RENDERER_VERSION', '1.0.0');
define('LATEX_RENDERER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('LATEX_RENDERER_PLUGIN_URL', plugin_dir_url(__FILE__));

// Meta key for storing LaTeX enable/disable setting
define('LATEX_RENDERER_META_KEY', '_latex_renderer_enabled');

/**
 * Register custom meta field for posts and pages
 */
function latex_renderer_register_meta() {
    register_post_meta('', LATEX_RENDERER_META_KEY, array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
        'default' => false,
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
}
add_action('init', 'latex_renderer_register_meta');

/**
 * Enqueue block editor assets
 */
function latex_renderer_enqueue_editor_assets() {
    wp_enqueue_script(
        'latex-renderer-editor',
        LATEX_RENDERER_PLUGIN_URL . 'js/editor.js',
        array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-i18n'),
        LATEX_RENDERER_VERSION,
        true
    );

    // Pass meta key to JavaScript
    wp_localize_script('latex-renderer-editor', 'latexRendererData', array(
        'metaKey' => LATEX_RENDERER_META_KEY
    ));
}
add_action('enqueue_block_editor_assets', 'latex_renderer_enqueue_editor_assets');

/**
 * Enqueue frontend assets (only when LaTeX is enabled for the post)
 */
function latex_renderer_enqueue_frontend_assets() {
    if (!is_singular()) {
        return;
    }

    $post_id = get_the_ID();
    $latex_enabled = get_post_meta($post_id, LATEX_RENDERER_META_KEY, true);

    if (!$latex_enabled) {
        return;
    }

    // Enqueue KaTeX CSS
    wp_enqueue_style(
        'katex',
        LATEX_RENDERER_PLUGIN_URL . 'assets/katex.min.css',
        array(),
        LATEX_RENDERER_VERSION
    );

    // Enqueue KaTeX JS
    wp_enqueue_script(
        'katex',
        LATEX_RENDERER_PLUGIN_URL . 'assets/katex.min.js',
        array(),
        LATEX_RENDERER_VERSION,
        true
    );

    // Enqueue KaTeX auto-render extension
    wp_enqueue_script(
        'katex-auto-render',
        LATEX_RENDERER_PLUGIN_URL . 'assets/auto-render.min.js',
        array('katex'),
        LATEX_RENDERER_VERSION,
        true
    );

    // Enqueue our custom frontend script
    wp_enqueue_script(
        'latex-renderer-frontend',
        LATEX_RENDERER_PLUGIN_URL . 'js/frontend.js',
        array('katex', 'katex-auto-render'),
        LATEX_RENDERER_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', 'latex_renderer_enqueue_frontend_assets');
