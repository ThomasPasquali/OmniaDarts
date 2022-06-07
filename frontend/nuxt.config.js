require('dotenv').config()

export default {
  server: {
    host: '0.0.0.0'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Omnia Darts",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {hid: "description", name: "description", content: ""},
      {name: "format-detection", content: "telephone=no"},
    ],
    link: [{rel: "icon", type: "image/x-icon", href: "/favicon.ico"}, {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:FILL@0..1'
    }],
    script: [{src: '/android.js'}],
  },

  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000/',
    io: {
      sockets: [
        {
          name: 'default',
          url: process.env.API_BASE_URL,
          default: true,
          vuex: {
            mutations: [
              'notification_new --> notifications/addNew',
              'notification_update --> notifications/update',
              'text_msg_room_new --> textchats/newMessage',
              'lobby_new_join_request --> lobbies/newJoinRequest',
              'new_throw --> match/setLastThrow',
              'match_won --> match/matchWon',
              'leg_won --> match/legWon',
            ],
            emitBacks: [
              'notification_update <-- notifications/lastNotification',
              'text_msg_new <-- textchats/lastMessage',
            ]
          },
          namespaces: {
            '/notifications': {
              /*emitBacks: ['sample3', 'sample4 <-- myObj.sample4'],
              emitters: [
                'reset] getProgress + refreshInfo --> progress [handleDone'
              ],
              listeners: ['progress']*/
            }
          }
        },
      ]
    },
  },

  privateRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000/'
    //apiSecret: process.env.API_SECRET
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["vant/lib/index.css", "assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/vant', '@/plugins/android'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/i18n', '@nuxtjs/axios', '@nuxtjs/auth-next', 'nuxt-socket-io'],

  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/',
    },
    strategies: {
      local: {
        token: {
          property: 'access_token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: false,
        },
        endpoints: {
          login: {url: process.env.API_BASE_URL + 'auth', method: 'post'},
          logout: {url: process.env.API_BASE_URL + 'auth/logout', method: 'post'},
          user: {url: process.env.API_BASE_URL + 'auth/user', method: 'get'}
        }
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        codeChallengeMethod: "",
        responseType: "code",
        endpoints: {
          token: process.env.API_BASE_URL + `auth/google`,
          userInfo: process.env.API_BASE_URL + `auth/google/user`,
        },
      },
    },
  },

  router: {
    middleware: ['auth']
  },

  i18n: {
    locales: [
      {code: "en", iso: "en-US", file: "en.js", name: "English"},
      {code: "it", iso: "it-IT", file: "it.js", name: "Italiano"},
    ],
    langDir: "locales",
    defaultLocale: "en",
    vueI18n: {
      fallbackLocale: "en",
    },
  },

  axios: {
    baseURL: process.env.API_BASE_URL, //Used as fallback if no runtime config is provided
  },



// Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      sass: {
        implementation: require('sass'),
      },
      scss: {
        implementation: require('sass'),
      },
    },
  }
};
