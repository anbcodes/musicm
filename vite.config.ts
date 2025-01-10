import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import basicSSL from '@vitejs/plugin-basic-ssl'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  test: {
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
    },
  },
});
