const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
    ...defaultConfig,
    entry: {
        ...defaultConfig.entry,
        'blocks/todo-manager/index': path.resolve( process.cwd(), 'src/blocks/todo-manager/index.js' ),
        'admin': path.resolve( process.cwd(), 'src/admin.js' ),
        'frontend': path.resolve( process.cwd(), 'src/frontend.js' ),
    },
    output: {
        ...defaultConfig.output,
        path: path.resolve( process.cwd(), 'build' ),
    },
};
