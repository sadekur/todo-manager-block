<?php
namespace TodoManagerBlock;

class Assets {
    public function __construct() {
        add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_assets' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
    }

    public function enqueue_block_assets() {
        $asset_file = include TODO_MANAGER_BLOCK_PATH . 'build/blocks/todo-manager/index.asset.php';

        if ( file_exists( TODO_MANAGER_BLOCK_PATH . 'build/blocks/todo-manager/index.js' ) ) {
            wp_enqueue_script(
                'todo-manager-block-editor',
                TODO_MANAGER_BLOCK_URL . 'build/blocks/todo-manager/index.js',
                $asset_file['dependencies'] ?? [],
                $asset_file['version'] ?? TODO_MANAGER_BLOCK_VERSION,
                true
            );
        }

        if ( file_exists( TODO_MANAGER_BLOCK_PATH . 'build/blocks/todo-manager/index.css' ) ) {
            wp_enqueue_style(
                'todo-manager-block-editor-style',
                TODO_MANAGER_BLOCK_URL . 'build/blocks/todo-manager/index.css',
                [],
                TODO_MANAGER_BLOCK_VERSION
            );
        }
    }

    public function enqueue_admin_assets( $hook ) {
        if ( 'toplevel_page_todo-manager' !== $hook ) {
            return;
        }

        $asset_file = include TODO_MANAGER_BLOCK_PATH . 'build/admin.asset.php';

        if ( file_exists( TODO_MANAGER_BLOCK_PATH . 'build/admin.js' ) ) {
            wp_enqueue_script(
                'todo-manager-admin',
                TODO_MANAGER_BLOCK_URL . 'build/admin.js',
                $asset_file['dependencies'] ?? [ 'wp-api-fetch', 'wp-data', 'wp-components', 'wp-element' ],
                $asset_file['version'] ?? TODO_MANAGER_BLOCK_VERSION,
                true
            );
        }

        if ( file_exists( TODO_MANAGER_BLOCK_PATH . 'build/admin.css' ) ) {
            wp_enqueue_style(
                'todo-manager-admin-style',
                TODO_MANAGER_BLOCK_URL . 'build/admin.css',
                [],
                TODO_MANAGER_BLOCK_VERSION
            );
        }

        wp_localize_script( 'todo-manager-admin', 'todoManagerData', [
            'apiUrl' => rest_url( 'wp/v2/todo-items' ),
            'nonce' => wp_create_nonce( 'wp_rest' ),
        ] );
    }

    public function enqueue_frontend_assets() {
        if ( ! has_block( 'todo-manager/todo-manager' ) ) {
            return;
        }

        $asset_file = include TODO_MANAGER_BLOCK_PATH . 'build/frontend.asset.php';

        if ( file_exists( TODO_MANAGER_BLOCK_PATH . 'build/frontend.js' ) ) {
            wp_enqueue_script(
                'todo-manager-frontend',
                TODO_MANAGER_BLOCK_URL . 'build/frontend.js',
                $asset_file['dependencies'] ?? [ 'wp-api-fetch', 'wp-element' ],
                $asset_file['version'] ?? TODO_MANAGER_BLOCK_VERSION,
                true
            );
        }

        if ( file_exists( TODO_MANAGER_BLOCK_PATH . 'build/frontend.css' ) ) {
            wp_enqueue_style(
                'todo-manager-frontend-style',
                TODO_MANAGER_BLOCK_URL . 'build/frontend.css',
                [],
                TODO_MANAGER_BLOCK_VERSION
            );
        }

        wp_localize_script( 'todo-manager-frontend', 'todoManagerFrontendData', [
            'apiUrl' => rest_url( 'wp/v2/todo-items' ),
            'nonce' => wp_create_nonce( 'wp_rest' ),
        ] );
    }
}
