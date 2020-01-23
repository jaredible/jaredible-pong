const path = require('path');

module.exports = {
    mode: "development",
    entry: path.join(__dirname, "./index.jsx"),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
}