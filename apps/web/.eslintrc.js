module.exports = {
  root: true,
  extends: [require.resolve('@monorepo/config-eslint/react')],
  ignorePatterns: ['build/', '.react-router/'],
};
