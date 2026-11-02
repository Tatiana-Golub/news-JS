const fs = require('fs');
const path = require('path');
const DotenvWebpackPlugin = require('dotenv-webpack');

const envPath = path.resolve(__dirname, './.env.development');

if (!fs.existsSync(envPath)) {
    throw new Error('Missing .env.development. Copy .env.development.example and add your NewsAPI key.');
}

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: path.resolve(__dirname, './dist'),
    },
    plugins: [new DotenvWebpackPlugin({ path: envPath })],
};
