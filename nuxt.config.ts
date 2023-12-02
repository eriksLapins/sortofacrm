// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    auth0: {
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER
    },
    ftp: {
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      host: process.env.MY_HOST,
      imageUrl: 'https://photos.lapinseriks.com',
      imagePath: '/public_html/images'
    },
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
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
      }
    }
  },
  svgo: {
    autoImportPath: './assets/svg/',
    defaultImport: 'component',
    global: false,
    componentPrefix: 'i'
  }
});
