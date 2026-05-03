import { registerBlockType } from '@wordpress/blocks';
import { Edit } from './edit';
import './editor.scss';

registerBlockType( 'todo-manager/todo-manager', {
    edit: Edit,
} );
