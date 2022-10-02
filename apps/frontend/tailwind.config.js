module.exports = {
  presets: [require('@sovryn/tailwindcss-config/index.js')],
  content: [
    './src/**/*.{html,ts,tsx,css}',
    '../../packages/ui/src/**/*.{html,ts,tsx,css}',
  ],
};
