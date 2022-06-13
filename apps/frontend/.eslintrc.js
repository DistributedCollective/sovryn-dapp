module.exports = {
  root: true,
  extends: ['custom'],
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useDebouncedEffect',
      },
    ],
  },
};
