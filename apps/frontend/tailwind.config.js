module.exports = {
  presets: [require('@sovryn/tailwindcss-config/index.js')],
  content: [
    './src/**/*.{html,ts,tsx,css}',
    './public/**/*.html',
    '../../packages/ui/src/**/*.{html,ts,tsx,css}',
  ],
  theme: {
    extend: {
      fontFamily: {
        druk: ['Druk LC'],
      },
    },
  },
};
