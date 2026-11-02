const DotenvWebpackPlugin = require('dotenv-webpack');

module.exports = {
    mode: 'production',
    output: {
        publicPath: '/news-JS/',
    },
    plugins: [new DotenvWebpackPlugin({ path: './.env.production' })],
};
