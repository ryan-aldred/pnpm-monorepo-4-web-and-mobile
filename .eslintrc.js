module.exports = {
  root: true,
  extends: [require.resolve('@monorepo/config-eslint/base')],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.expo/',
    '.react-router/',
  ],
};
