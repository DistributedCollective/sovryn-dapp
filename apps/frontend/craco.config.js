const CracoEnvPlugin = require('craco-plugin-env');

module.exports = {
  plugins: [
    {
      plugin: CracoEnvPlugin,
      options: {
        variables: {},
      },
    },
  ],
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
      return config;
    },
  },
  babel: {
    presets: ['@babel/preset-react'],
  },
};
