const dotenvCra = require('dotenv-cra');
const webpack = require('webpack');
const fs = require('fs');

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const GenerateFilePlugin = require('generate-file-webpack-plugin');

process.env.REACT_APP_GIT_COMMIT_ID = new GitRevisionPlugin().commithash();

const currentReleaseContent = JSON.parse(
  fs.readFileSync('./public/release.json'),
);

const packageJsonVersion = JSON.parse(
  fs.readFileSync('./package.json'),
).version;

const appMode = process.env.APP_MODE;
if (appMode) {
  dotenvCra.config({ env: appMode });
}
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
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        assert: require.resolve('assert/'),
      };
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        GenerateFilePlugin({
          file: 'release.json',
          content: JSON.stringify({
            ...currentReleaseContent,
            version: packageJsonVersion,
            commit: process.env.REACT_APP_GIT_COMMIT_ID,
          }),
        }),
      ]);
      return config;
    },
  },
  babel: {
    presets: ['@babel/preset-react'],
  },
};
