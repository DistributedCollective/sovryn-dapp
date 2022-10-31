const webpack = require('webpack');

module.exports = {
  style: {
    postcss: {
      loaderOptions: postcssLoaderOptions => {
        postcssLoaderOptions.postcssOptions = require('@sovryn/tailwindcss-config/postcss.config.js');
        return postcssLoaderOptions;
      },
    },
  },
  webpack: {
    configure: config => {
      // ts-loader is required to reference external typescript projects/files (non-transpiled)
      config.module.rules.push({
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.json',
        },
      });
      config.ignoreWarnings = [/Failed to parse source map/];
      config.resolve.fallback = {
        stream: require.resolve('readable-stream'),
        buffer: require.resolve('buffer'),
      };
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);
      return config;
    },
  },
  babel: {
    presets: ['@babel/preset-react'],
  },
};
