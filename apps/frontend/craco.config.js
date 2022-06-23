module.exports = {
  style: {
    postcss: {
      loaderOptions: postcssLoaderOptions => {
        postcssLoaderOptions.postcssOptions = require('@sovryn/tailwindcss-config/postcss.config.js');

        return postcssLoaderOptions;
      },
    },
  },
};
