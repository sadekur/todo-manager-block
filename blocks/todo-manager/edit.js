import { useBlockProps } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { TextControl, Button, Spinner, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export function Edit() {
    const blockProps = useBlockProps();
    const [todos, setTodos] = useState( [] );
    const [newTodo, setNewTodo] = useState( '' );
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState( null );

    const fetchTodos = async () => {
        try {
            setLoading( true );
            const data = await apiFetch( {
                path: '/wp/v2/todo-items?per_page=100&_fields=id,title,meta,date',
                method: 'GET',
            } );
            setTodos( data );
            setError( null );
        } catch ( err ) {
            setError( 'Failed to load todos' );
        } finally {
            setLoading( false );
        }
    };

    useEffect( () => {
        fetchTodos();
    }, [] );

    const addTodo = async () => {
        if ( ! newTodo.trim() ) return;

        try {
            const now = new Date().toISOString();
            await apiFetch( {
                path: '/wp/v2/todo-items',
                method: 'POST',
                data: {
                    title: newTodo,
                    status: 'publish',
                    meta: {
                        status: 'incomplete',
                        created_at: now,
                        updated_at: now,
                    },
                },
            } );
            setNewTodo( '' );
            fetchTodos();
        } catch ( err ) {
            setError( 'Failed to add todo' );
        }
    };

    const toggleTodo = async ( todoId, currentStatus ) => {
        try {
            const now = new Date().toISOString();
            await apiFetch( {
                path: `/wp/v2/todo-items/${ todoId }`,
                method: 'POST',
                data: {
                    meta: {
                        status: currentStatus === 'complete' ? 'incomplete' : 'complete',
                        updated_at: now,
                    },
                },
            } );
            fetchTodos();
        } catch ( err ) {
            setError( 'Failed to update todo' );
        }
    };

    const deleteTodo = async ( todoId ) => {
        try {
            await apiFetch( {
                path: `/wp/v2/todo-items/${ todoId }`,
                method: 'DELETE',
            } );
            fetchTodos();
        } catch ( err ) {
            setError( 'Failed to delete todo' );
        }
    };

    return (
        <div { ...blockProps }>
            <div className="todo-manager-editor">
                <h3>Todo Manager</h3>
                { error && <Notice status="error" onRemove={ () => setError( null ) }>{ error }</Notice> }
                <div className="todo-manager-add">
                    <TextControl
                        label="New Todo"
                        value={ newTodo }
                        onChange={ setNewTodo }
                        onKeyDown={ ( e ) => e.key === 'Enter' && addTodo() }
                    />
                    <Button variant="primary" onClick={ addTodo } disabled={ ! newTodo.trim() }>
                        Add Todo
                    </Button>
                </div>
                { loading ? (
                    <Spinner />
                ) : (
                    <ul className="todo-list">
                        { todos.map( ( todo ) => (
                            <li key={ todo.id } className={ `todo-item ${ todo.meta?.status || 'incomplete' }` }>
                                <span
                                    className="todo-title"
                                    style={ {
                                        textDecoration: todo.meta?.status === 'complete' ? 'line-through' : 'none',
                                    } }
                                >
                                    { todo.title?.rendered || todo.title }
                                </span>
                                <div className="todo-actions">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={ () => toggleTodo( todo.id, todo.meta?.status ) }
                                    >
                                        { todo.meta?.status === 'complete' ? 'Undo' : 'Complete' }
                                    </Button>
                                    <Button
                                        variant="tertiary"
                                        size="small"
                                        onClick={ () => deleteTodo( todo.id ) }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ) ) }
                    </ul>
                ) }
            </div>
        </div>
    );
}
