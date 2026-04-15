import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/api/**'],
    },
  },
})
