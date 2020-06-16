module.exports = {
    'apps': [{
        'name': 'API',
        'script': './dist/main.js',
        'exec_mode': 'cluster',
        'instances': 'max',
        'merge_logs': true,
        'watch': true,
        'env': {
            'NODE_ENV': 'production',
        },
    }],
};
