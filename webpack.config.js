const path = require("path");

module.exports = {
  // mode: 'production',
  mode: "development",
  entry: ['./src/script/main.ts'],
  // entry: ["@babel/polyfill", "./src/script/main.ts"],
  output: {
    path: path.resolve(__dirname, "build/script"),
    publicPath: "./build/script/",
    filename: "main.js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".wasm"]
  },
  module: {
    rules: [
      {
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        test: /\.ts$/,
        // exclude: /(node_modules)/,
        use: [
          // {
          //   loader: "babel-loader",
          //   options: {
          //     presets: [["@babel/preset-env"]]
          //   }
          // },
          { loader: "ts-loader" }
        ]
      },
      {
        test: /\.wasm$/,
        type: "webassembly/experimental"
      }
    ]
  }
};
