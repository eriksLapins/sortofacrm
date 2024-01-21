// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';

export default defineNuxtConfig({
    devtools: { enabled: true },
    app: {
        head: {
            title: 'SortofaCRM',
            link: [{ rel: 'icon', type: 'image/svg', href: '/soa_logo.svg' }]
        }
    },
    runtimeConfig: {
        DATABASE_URL: process.env.DATABASE_URL,
        auth: {
            secret: process.env.NUXTAUTH_SECRET
        },
        public: {
            base_url: process.env.NUXT_PUBLIC_BASE_URL
        }
    },
    nitro: {
        experimental: {
            openAPI: true
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
        'nuxt-svgo',
        '@nuxt/image'
    ],
    piniaPersistedstate: {
        cookieOptions: {
            sameSite: 'strict'
        },
        storage: 'cookies'
    },
    ssr: true,
    vite: {
        resolve: {
            alias: {
                '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
            }
        },
        optimizeDeps: {
            include: [
                'date-fns'
            ],
            exclude: []
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
