<?php
namespace TodoManagerBlock;

class Plugin {
    private static $instance = null;

    public static function instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
            self::$instance->init();
        }
        return self::$instance;
    }

    private function init() {
        $this->load_classes();
        $this->init_hooks();
    }

    private function load_classes() {
        require_once TODO_MANAGER_BLOCK_PATH . 'includes/class-post-type.php';
        require_once TODO_MANAGER_BLOCK_PATH . 'includes/class-admin.php';
        require_once TODO_MANAGER_BLOCK_PATH . 'includes/class-assets.php';
    }

    private function init_hooks() {
        add_action( 'init', [ $this, 'init_blocks' ] );
        new Post_Type();
        new Admin();
        new Assets();
    }

    public function init_blocks() {
        register_block_type(
            TODO_MANAGER_BLOCK_PATH . 'blocks/todo-manager/'
        );
    }
}
