import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createVitestConfig(rootDir: string) {
  return defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [path.resolve(__dirname, './setup.ts')],
      include: ['**/*.{test,spec}.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.{idea,git,cache,output,temp}/**',
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          '**/*.config.*',
          '**/*.d.ts',
          '**/test-utils/**',
          '**/tests/**',
          '**/mocks/**',
        ],
      },
    },
  });
}
