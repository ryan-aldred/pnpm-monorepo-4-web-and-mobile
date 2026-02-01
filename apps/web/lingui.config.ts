import { defineConfig } from '@lingui/conf';

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'es', 'fr'],
  catalogs: [
    {
      path: '<rootDir>/app/locales/{locale}/messages',
      include: ['app'],
    },
  ],
  format: 'po',
});
