import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import basicSSL from '@vitejs/plugin-basic-ssl'
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
});
