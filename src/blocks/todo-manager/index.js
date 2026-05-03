import { registerBlockType } from '@wordpress/blocks';
import { Edit } from './edit';
import './style.scss';
import './editor.scss';

registerBlockType( 'todo-manager/todo-manager', {
    edit: Edit,
} );
