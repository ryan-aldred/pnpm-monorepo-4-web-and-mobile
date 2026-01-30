import path from 'path';
import { fileURLToPath } from 'url';
import { reactRouter } from '@react-router/dev/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig, Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Plugin to resolve TypeScript imports without extensions in SSR
function ssrExtensionResolver(): Plugin {
  return {
    name: 'ssr-extension-resolver',
    enforce: 'pre',
    resolveId(source, importer, options) {
      if (options.ssr && importer && source.startsWith('.')) {
        // Try adding .ts extension for relative imports
        const extensions = ['.ts', '.tsx', '/index.ts'];
        for (const _ext of extensions) {
          return null; // Let Vite's default resolver handle it with the extension
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    tsconfigPaths(),
    ssrExtensionResolver(),
    cloudflareDevProxy(),
    reactRouter(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
      '@monorepo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@monorepo/types': path.resolve(__dirname, '../../packages/types/src'),
      '@monorepo/database': path.resolve(__dirname, '../../packages/database/src/index.ts'),
      '@monorepo/i18n/locales': path.resolve(__dirname, '../../packages/i18n/src/locales'),
      '@monorepo/i18n': path.resolve(__dirname, '../../packages/i18n/src/index.ts'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    dedupe: ['react', 'react-dom', '@lingui/react', '@lingui/core'],
  },
  optimizeDeps: {
    exclude: ['@lingui/react'],
  },
  ssr: {
    noExternal: ['@monorepo/types', '@monorepo/ui', '@monorepo/database', '@monorepo/i18n', '@lingui/core', '@lingui/react'],
    target: 'webworker',
  },
});
