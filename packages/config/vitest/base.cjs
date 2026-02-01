const { defineConfig } = require('vitest/config');
const path = require('path');

function createVitestConfig(rootDir) {
  return defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [path.resolve(__dirname, './setup.mjs')],
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

module.exports = { createVitestConfig };
