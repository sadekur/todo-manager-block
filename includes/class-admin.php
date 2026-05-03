<?php
namespace TodoManagerBlock;

class Admin {
    public function __construct() {
        add_action( 'admin_menu', [ $this, 'add_admin_menu' ] );
    }

    public function add_admin_menu() {
        add_menu_page(
            __( 'Todo Manager', 'todo-manager-block' ),
            __( 'Todo Manager', 'todo-manager-block' ),
            'manage_options',
            'todo-manager',
            [ $this, 'render_admin_page' ],
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
