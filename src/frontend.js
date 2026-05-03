import { render } from '@wordpress/element';
import { useState, useEffect } from '@wordpress/element';
import { TextControl, Button, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const TodoManagerFrontend = () => {
    const [todos, setTodos] = useState( [] );
    const [newTodo, setNewTodo] = useState( '' );
    const [loading, setLoading] = useState( true );

    const fetchTodos = async () => {
        try {
            setLoading( true );
            const data = await apiFetch( {
                path: '/wp/v2/todo-items?per_page=100&_fields=id,title,meta,date',
                method: 'GET',
            } );
            setTodos( data );
        } catch ( err ) {
            console.error( 'Failed to load todos', err );
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
            console.error( 'Failed to add todo', err );
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
            console.error( 'Failed to update todo', err );
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
            console.error( 'Failed to delete todo', err );
        }
    };

    return (
        <div className="todo-manager-frontend">
            <h3>Todo Manager</h3>
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
    );
};

document.querySelectorAll( '#todo-manager-frontend-root' ).forEach( ( root ) => {
    render( <TodoManagerFrontend />, root );
} );
