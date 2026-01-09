import { defineConfig } from 'vitest/config';
import { createVitestConfig } from '@monorepo/config-vitest/base';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '@monorepo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@monorepo/core': path.resolve(__dirname, '../../packages/core/src'),
      '@monorepo/types': path.resolve(__dirname, '../../packages/types/src'),
      '@monorepo/config-testing': path.resolve(__dirname, '../../packages/config/testing/src'),
    },
  },
  ...createVitestConfig(__dirname),
});
