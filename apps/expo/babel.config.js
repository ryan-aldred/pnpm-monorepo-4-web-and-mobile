module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './app',
            '@monorepo/ui': '../../packages/ui/src',
            '@monorepo/core': '../../packages/core/src',
            '@monorepo/types': '../../packages/types/src',
            'better-auth/react': 'better-auth/react',
          },
        },
      ],
    ],
  };
};
