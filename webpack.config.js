module.exports = {
    // mode: 'production',
    mode: 'development',
    output: {
      filename: 'main.js'
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
          test: /\.ts$/,
          use: 'ts-loader'
        }
      ]
    }
  }