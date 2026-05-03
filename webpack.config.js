const path = require( 'path' );

module.exports = {
    entry: {
        'blocks/todo-manager/index': path.resolve( process.cwd(), 'blocks/todo-manager/index.js' ),
        'admin': path.resolve( process.cwd(), 'src/admin.js' ),
        'frontend': path.resolve( process.cwd(), 'src/frontend.js' ),
    },
    output: {
        filename: '[name].js',
        path: path.resolve( process.cwd(), 'build' ),
    },
};
