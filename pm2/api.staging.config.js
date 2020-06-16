module.exports = {
    'apps': [{
        'name': 'API',
        'script': './dist/main.js',
        'exec_mode': 'cluster',
        'instances': 'max',
        'merge_logs': true,
        'watch': false,
        'env': {
            'NODE_ENV': 'development',
        },
    }],
};
