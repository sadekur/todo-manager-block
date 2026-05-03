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
        require_once TODO_MANAGER_BLOCK_PATH . 'src/php/Post_Type.php';
        require_once TODO_MANAGER_BLOCK_PATH . 'src/php/Admin.php';
        require_once TODO_MANAGER_BLOCK_PATH . 'src/php/Assets.php';
    }

    private function init_hooks() {
        add_action( 'init', array( $this, 'init_blocks' ) );
        Post_Type::instance();
        Admin::instance();
        Assets::instance();
    }

    public function init_blocks() {
        register_block_type(
            TODO_MANAGER_BLOCK_PATH . 'blocks/todo-manager/'
        );
    }
}
