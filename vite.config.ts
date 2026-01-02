import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';

// Read manifest
import manifest from './src/manifest.json';

export default defineConfig({
    plugins: [
        crx({ manifest }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist',
        emptyDirBeforeWrite: true,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup/index.html'),
                options: resolve(__dirname, 'src/options/index.html'),
                modheader: resolve(__dirname, 'src/modheader/index.html'),
                devtools: resolve(__dirname, 'src/devtools/index.html'),
            },
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173,
        },
    },
});
