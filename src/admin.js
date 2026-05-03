import { render } from '@wordpress/element';
import { useState, useEffect } from '@wordpress/element';
import { TextControl, Button, Card, CardBody, Spinner, Notice, Modal, Flex, FlexItem } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './style.scss';

const TodoManagerAdmin = () => {
    const [todos, setTodos] = useState( [] );
    const [newTodo, setNewTodo] = useState( '' );
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState( null );
    const [editingTodo, setEditingTodo] = useState( null );
    const [editTitle, setEditTitle] = useState( '' );
    const [search, setSearch] = useState( '' );

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

    const startEdit = ( todo ) => {
        setEditingTodo( todo );
        setEditTitle( todo.title?.rendered || todo.title );
    };

    const saveEdit = async () => {
        if ( ! editTitle.trim() ) return;

        try {
            const now = new Date().toISOString();
            await apiFetch( {
                path: `/wp/v2/todo-items/${ editingTodo.id }`,
                method: 'POST',
                data: {
                    title: editTitle,
                    meta: {
                        updated_at: now,
                    },
                },
            } );
            setEditingTodo( null );
            setEditTitle( '' );
            fetchTodos();
        } catch ( err ) {
            setError( 'Failed to update todo' );
        }
    };

    const filteredTodos = todos.filter( ( todo ) => {
        const title = todo.title?.rendered || todo.title || '';
        return title.toLowerCase().includes( search.toLowerCase() );
    } );

    return (
        <div className="todo-manager-admin">
            { error && <Notice status="error" onRemove={ () => setError( null ) }>{ error }</Notice> }

            <Card>
                <CardBody>
                    <Flex>
                        <FlexItem>
                            <TextControl
                                label="New Todo"
                                value={ newTodo }
                                onChange={ setNewTodo }
                                onKeyDown={ ( e ) => e.key === 'Enter' && addTodo() }
                            />
                        </FlexItem>
                        <FlexItem>
                            <Button variant="primary" onClick={ addTodo } disabled={ ! newTodo.trim() }>
                                Add Todo
                            </Button>
                        </FlexItem>
                    </Flex>
                </CardBody>
            </Card>

            <div className="todo-search" style={ { margin: '20px 0' } }>
                <TextControl
                    label="Search Todos"
                    value={ search }
                    onChange={ setSearch }
                    placeholder="Search..."
                />
            </div>

            { loading ? (
                <Spinner />
            ) : (
                <div className="todo-list">
                    { filteredTodos.map( ( todo ) => (
                        <Card key={ todo.id } style={ { marginBottom: '10px' } }>
                            <CardBody>
                                <Flex align="center">
                                    <FlexItem style={ { flex: 1 } }>
                                        <span
                                            style={ {
                                                textDecoration: todo.meta?.status === 'complete' ? 'line-through' : 'none',
                                            } }
                                        >
                                            { todo.title?.rendered || todo.title }
                                        </span>
                                    </FlexItem>
                                    <FlexItem>
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
                                            onClick={ () => startEdit( todo ) }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="tertiary"
                                            size="small"
                                            onClick={ () => deleteTodo( todo.id ) }
                                        >
                                            Delete
                                        </Button>
                                    </FlexItem>
                                </Flex>
                            </CardBody>
                        </Card>
                    ) ) }
                </div>
            ) }

            { editingTodo && (
                <Modal
                    title="Edit Todo"
                    onRequestClose={ () => setEditingTodo( null ) }
                >
                    <TextControl
                        label="Todo Title"
                        value={ editTitle }
                        onChange={ setEditTitle }
                        onKeyDown={ ( e ) => e.key === 'Enter' && saveEdit() }
                    />
                    <Button variant="primary" onClick={ saveEdit }>
                        Save
                    </Button>
                </Modal>
            ) }
        </div>
    );
};

render( <TodoManagerAdmin />, document.getElementById( 'todo-manager-admin-root' ) );
