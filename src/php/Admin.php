<?php
namespace TodoManagerBlock;

class Admin {
    private static $instance = null;

    public static function instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
            self::$instance->init_hooks();
        }
        return self::$instance;
    }

    private function init_hooks() {
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
    }

    public function add_admin_menu() {
        add_menu_page(
            __( 'Todo Manager', 'todo-manager-block' ),
            __( 'Todo Manager', 'todo-manager-block' ),
            'manage_options',
            'todo-manager',
            array( $this, 'render_admin_page' ),
            'dashicons-yes-alt',
            30
        );
    }

    public function render_admin_page() {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__( 'Todo Manager', 'todo-manager-block' ) . '</h1>';
        echo '<div id="todo-manager-admin-root"></div>';
        echo '</div>';
    }
}
