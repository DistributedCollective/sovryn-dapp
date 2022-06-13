module.exports = {
  root: true,
  extends: ['@sovryn/eslint-config-custom'],
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useDebouncedEffect',
      },
    ],
  },
};
