// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        DATABASE_URL: process.env.DATABASE_URL,
        auth: {
            secret: process.env.NUXTAUTH_SECRET
        },
        public: {
            base_url: process.env.NUXT_PUBLIC_BASE_URL
        }
    },
    css: ['~/assets/css/main.css',
        '~/scss/style.scss'],
    postcss: {
        plugins: {
            'postcss-import': {},
            'tailwindcss/nesting': 'postcss-nesting',
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        'nuxt-svgo'
    ],
    piniaPersistedstate: {
        cookieOptions: {
            sameSite: 'strict'
        },
        storage: 'cookies'
    },
    ssr: true,
    vite: {
        plugins: [react()],
        resolve: {
            alias: {
                '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
                '@': resolve(__dirname, './src')
            }
        }
    },
    svgo: {
        autoImportPath: './assets/svg/',
        defaultImport: 'component',
        global: false,
        componentPrefix: 'i'
    },
    alias: {
        '~db': resolve(__dirname, './server/api/db')
    }
});
