import { registerBlockType } from '@wordpress/blocks';
import { Edit } from './edit';

registerBlockType( 'todo-manager/todo-manager', {
    edit: Edit,
} );
