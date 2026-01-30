module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@lingui/babel-plugin-lingui-macro',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './app',
            '@monorepo/ui': '../../packages/ui/src',
            '@monorepo/core': '../../packages/core/src',
            '@monorepo/types': '../../packages/types/src',
            '@monorepo/i18n': '../../packages/i18n/src',
            'better-auth/react': 'better-auth/react',
          },
        },
      ],
    ],
  };
};
