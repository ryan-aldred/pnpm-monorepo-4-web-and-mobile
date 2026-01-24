module.exports = {
  root: true,
  extends: [require.resolve('@monorepo/config-eslint/native')],
  ignorePatterns: ['.expo/'],
  env: {
    jest: true,
  },
  overrides: [
    {
      files: ['*.config.js', 'metro.config.js', 'tailwind.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
};
