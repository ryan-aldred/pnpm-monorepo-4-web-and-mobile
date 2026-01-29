import { reactRouter } from '@react-router/dev/vite';
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
      '~': '/app',
      '@monorepo/ui': '../../packages/ui/src',
      '@monorepo/types': '../../packages/types/src',
      '@monorepo/database': '../../packages/database/src/index.ts',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  ssr: {
    noExternal: ['@monorepo/types', '@monorepo/ui', '@monorepo/database'],
    target: 'webworker',
  },
});
