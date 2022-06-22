module.exports = {
  style: {
    postcss: {
      loaderOptions: postcssLoaderOptions => {
        postcssLoaderOptions.postcssOptions = require('@sovryn/tailwind/postcss.config.js');

        return postcssLoaderOptions;
      },
    },
  },
};
