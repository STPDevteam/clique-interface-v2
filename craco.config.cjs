const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  webpack: {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      minimize: true,
      minimizer: [
        // 使用 UglifyJsPlugin 进行压缩
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false
        })
      ]
    }
  }
}
