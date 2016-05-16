module.exports = function() {
    var config = {
        alljs: [
            './*.js',
            './public/customjs/*.js',
            './models/*.js',
            './routes/*.js'
        ]
    };
    return config;
};
