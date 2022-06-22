module.exports = {
  style: {
    postcss: {
      loaderOptions: postcssLoaderOptions => {
        postcssLoaderOptions.postcssOptions.plugins = [
          require('postcss-import'),
          require('tailwindcss/nesting'),
          require('tailwindcss'),
          'postcss-flexbugs-fixes',
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 0,
            },
          ],
        ];

        return postcssLoaderOptions;
      },
    },
  },
};
