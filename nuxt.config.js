require('dotenv').config()
const {
  FIREBASE_API_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET_ID,
  GOOGLE_API_URL,
  API_URL,
  WEB_URL,
} = process.env

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'yoobook',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/styles.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/gsap.js', mode: 'client' },
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/flipbook.js', mode: 'client' },
    { src: '~/plugins/icon.js', mode: 'client' },
    { src: '~/plugins/qs.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    scss: ['@/assets/scss/abstracts/__abstracts-dir.scss'],
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    'cookie-universal-nuxt',
  ],

  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false, // Or `bvCSS: false`
    componentPlugins: [
      'LayoutPlugin',
      'FormPlugin',
      'FormCheckboxPlugin',
      'FormInputPlugin',
      'FormRadioPlugin',
      'ToastPlugin',
      'ModalPlugin',
    ],
    directivePlugins: [
      'VBPopoverPlugin',
      'VBTooltipPlugin',
      'VBScrollspyPlugin',
    ],
    components: [
      'BContainer',
      'BRow',
      'BCol',
      'BFormInput',
      'BButton',
      'BTable',
      'BModal',
      'BFormGroup',
      'BFormSelect',
      'BInputGroup',
      'BInputGroupAppend',
      'BPagination',
      'BCard',
    ],
    directives: ['VBModal', 'VBPopover', 'VBTooltip', 'VBScrollspy'],
    icons: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    babel: {
      compact: false,
    },
  },

  serverMiddleware: [
    { path: '/auth', handler: '~/server/auth.js' },
    { path: '/api', handler: '~/server/api.js' },
  ],
  // target: 'static',
  env: {
    FIREBASE_API_KEY,
    GOOGLE_CLIENT_ID,
    GOOGLE_SECRET_ID,
    GOOGLE_API_URL,
    API_URL,
    WEB_URL,
  },
}
