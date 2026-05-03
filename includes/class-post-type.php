<?php
namespace TodoManagerBlock;

class Post_Type {
    private $post_type = 'todo_item';

    public function __construct() {
        add_action( 'init', [ $this, 'register_post_type' ] );
        add_action( 'rest_api_init', [ $this, 'register_rest_fields' ] );
    }

    public function register_post_type() {
        register_post_type( $this->post_type, [
            'labels' => [
                'name' => __( 'Todo Items', 'todo-manager-block' ),
                'singular_name' => __( 'Todo Item', 'todo-manager-block' ),
            ],
            'public' => false,
            'show_ui' => false,
            'show_in_rest' => true,
            'rest_base' => 'todo-items',
            'supports' => [ 'title', 'custom-fields' ],
            'has_archive' => false,
        ] );

        register_post_meta( $this->post_type, 'status', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'default' => 'incomplete',
        ] );

        register_post_meta( $this->post_type, 'created_at', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
        ] );

        register_post_meta( $this->post_type, 'updated_at', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
        ] );
    }

    public function register_rest_fields() {
        register_rest_field( $this->post_type, 'todo_data', [
            'get_callback' => [ $this, 'get_todo_data' ],
            'update_callback' => null,
            'schema' => null,
        ] );
    }

    public function get_todo_data( $object ) {
        return [
            'status' => get_post_meta( $object['id'], 'status', true ),
            'created_at' => get_post_meta( $object['id'], 'created_at', true ),
            'updated_at' => get_post_meta( $object['id'], 'updated_at', true ),
        ];
    }
}
