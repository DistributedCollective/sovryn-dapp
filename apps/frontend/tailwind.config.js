module.exports = {
  presets: [require('@sovryn/tailwindcss-config/index.js')],
  content: [
    './src/**/*.{html,ts,tsx}',
    '../../packages/ui/src/**/*.{html,ts,tsx}',
  ],
};
