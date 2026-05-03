<?php
/**
 * Plugin Name: Todo Manager Block
 * Plugin URI: https://example.com/todo-manager-block
 * Description: A synchronized Todo system with Gutenberg block and admin page.
 * Version: 1.0.0
 * Author: Todo Manager Team
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: todo-manager-block
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'TODO_MANAGER_BLOCK_VERSION', '1.0.0' );
define( 'TODO_MANAGER_BLOCK_PATH', plugin_dir_path( __FILE__ ) );
define( 'TODO_MANAGER_BLOCK_URL', plugin_dir_url( __FILE__ ) );

require_once TODO_MANAGER_BLOCK_PATH . 'vendor/autoload.php';
require_once TODO_MANAGER_BLOCK_PATH . 'src/php/Plugin.php';

function todo_manager_block_init() {
    return \TodoManagerBlock\Plugin::instance();
}

add_action( 'plugins_loaded', 'todo_manager_block_init' );
