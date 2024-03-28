// webpack.config.js

module.exports = {
    // other webpack configurations
    resolve: {
      fallback: {
        util: require.resolve('util/'),
        crypto: require.resolve('crypto-browserify'),
        // Add more fallbacks as needed for other missing modules
      },
    },
  };
  