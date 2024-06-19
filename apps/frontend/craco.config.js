const dotenvCra = require('dotenv-cra');
const webpack = require('webpack');
const fs = require('fs');

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const GenerateFilePlugin = require('generate-file-webpack-plugin');

const appMode = process.env.APP_MODE;
if (appMode) {
  dotenvCra.config({ env: appMode });
}

const currentReleaseContent = JSON.parse(
  fs.readFileSync('./public/release.json'),
);

const packageJsonVersion = JSON.parse(
  fs.readFileSync('./package.json'),
).version;

const releaseFileContents = JSON.stringify({
  ...currentReleaseContent,
  version: packageJsonVersion,
  commit: new GitRevisionPlugin().commithash(),
});

process.env.REACT_APP_RELEASE_DATA = releaseFileContents;

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
      config.ignoreWarnings = [
        /Failed to parse source map/,
        /Configure maximumFileSizeToCacheInBytes to change this limit/,
      ];
      config.resolve.fallback = {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
      };
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        GenerateFilePlugin({
          file: 'release.json',
          content: process.env.REACT_APP_RELEASE_DATA,
        }),
      ]);
      return config;
    },
  },
  babel: {
    presets: ['@babel/preset-react'],
  },
};
