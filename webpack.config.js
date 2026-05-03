const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
    ...defaultConfig,
    entry: {
        'blocks/todo-manager/index': path.resolve( process.cwd(), 'blocks/todo-manager/index.js' ),
        'admin': path.resolve( process.cwd(), 'src/admin.js' ),
        'frontend': path.resolve( process.cwd(), 'src/frontend.js' ),
    },
    output: {
        filename: ( pathData ) => {
            return pathData.chunk.name === 'blocks/todo-manager/index' 
                ? 'blocks/todo-manager/index.js'
                : '[name].js';
        },
        path: path.resolve( process.cwd(), 'build' ),
    },
};
