const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
    mode: "development",
    entry: __dirname + "/src/index.js",
    output: {
        path: __dirname + "/dist",
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // add CSS extraction on prod
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    watch: true,
    watchOptions: {
        poll: true,
        ignored: /node_modules/
    },
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['dist'] }
        })
    ]
};
