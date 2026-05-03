<?php
namespace TodoManagerBlock;

class Post_Type {
    private $post_type = 'todo_item';

    public function __construct() {
        add_action( 'init', [ $this, 'register_post_type' ] );
        add_action( 'rest_api_init', [ $this, 'register_rest_fields' ] );
        add_filter( 'rest_prepare_todo_item', [ $this, 'prepare_rest_response' ], 10, 3 );
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
            'show_in_admin_bar' => false,
            'exclude_from_search' => true,
        ] );

        register_post_meta( $this->post_type, 'status', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'default' => 'incomplete',
            'auth_callback' => function() {
                return current_user_can( 'edit_posts' );
            },
        ] );

        register_post_meta( $this->post_type, 'created_at', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function() {
                return current_user_can( 'edit_posts' );
            },
        ] );

        register_post_meta( $this->post_type, 'updated_at', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function() {
                return current_user_can( 'edit_posts' );
            },
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

    public function prepare_rest_response( $response, $post, $request ) {
        $meta = get_post_meta( $post->ID );
        
        $response->data['meta'] = [
            'status' => $meta['status'][0] ?? 'incomplete',
            'created_at' => $meta['created_at'][0] ?? '',
            'updated_at' => $meta['updated_at'][0] ?? '',
        ];

        return $response;
    }
}
