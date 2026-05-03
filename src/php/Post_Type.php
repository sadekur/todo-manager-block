<?php
namespace TodoManagerBlock;

class Post_Type {
    private $post_type = 'todo_item';
    private static $instance = null;

    public static function instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
            self::$instance->init_hooks();
        }
        return self::$instance;
    }

    private function init_hooks() {
        add_action( 'init', [ $this, 'register_post_type' ] );
        add_action( 'rest_api_init', [ $this, 'register_rest_fields' ] );
        add_filter( 'rest_prepare_todo_item', [ $this, 'prepare_rest_response' ], 10, 3 );
    }

    public function register_post_type() {
        register_post_type( $this->post_type, array(
            'labels' => array(
                'name' => __( 'Todo Items', 'todo-manager-block' ),
                'singular_name' => __( 'Todo Item', 'todo-manager-block' ),
            ),
            'public' => false,
            'show_ui' => false,
            'show_in_rest' => true,
            'rest_base' => 'todo-items',
            'supports' => array( 'title', 'custom-fields' ),
            'has_archive' => false,
        ) );

        register_post_meta( $this->post_type, 'status', array(
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'default' => 'incomplete',
            'auth_callback' => function() { return current_user_can( 'edit_posts' ); },
        ) );

        register_post_meta( $this->post_type, 'created_at', array(
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function() { return current_user_can( 'edit_posts' ); },
        ) );

        register_post_meta( $this->post_type, 'updated_at', array(
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function() { return current_user_can( 'edit_posts' ); },
        ) );
    }

    public function register_rest_fields() {
        register_rest_field( $this->post_type, 'todo_data', array(
            'get_callback' => array( $this, 'get_todo_data' ),
            'update_callback' => null,
            'schema' => null,
        ) );
    }

    public function get_todo_data( $object ) {
        return array(
            'status' => get_post_meta( $object['id'], 'status', true ),
            'created_at' => get_post_meta( $object['id'], 'created_at', true ),
            'updated_at' => get_post_meta( $object['id'], 'updated_at', true ),
        );
    }

    public function prepare_rest_response( $response, $post, $request ) {
        $response->data['meta'] = array(
            'status' => get_post_meta( $post->ID, 'status', true ) ? get_post_meta( $post->ID, 'status', true ) : 'incomplete',
            'created_at' => get_post_meta( $post->ID, 'created_at', true ) ? get_post_meta( $post->ID, 'created_at', true ) : '',
            'updated_at' => get_post_meta( $post->ID, 'updated_at', true ) ? get_post_meta( $post->ID, 'updated_at', true ) : '',
        );
        return $response;
    }
}
