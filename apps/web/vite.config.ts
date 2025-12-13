import { reactRouter } from '@react-router/dev/vite';
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
        for (const ext of extensions) {
          const candidate = source + ext;
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
  plugins: [tsconfigPaths(), ssrExtensionResolver(), reactRouter()],
  resolve: {
    alias: {
      '~': '/app',
      '@monorepo/ui': '../../packages/ui/src',
      '@monorepo/types': '../../packages/types/src',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  ssr: {
    noExternal: ['@monorepo/types', '@monorepo/ui'],
    target: 'node',
  },
});
