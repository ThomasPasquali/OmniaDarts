export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Omnia Darts",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["vant/lib/index.css", "assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["@/plugins/vant"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/i18n", "@nuxtjs/axios", "@nuxtjs/auth-next"],

  auth: {
    strategies: {
      google: {
        clientId:
          "74003974763-het7c7fbnm4j7ov5dc4lvhf2sgbalha1.apps.googleusercontent.com",
        codeChallengeMethod: "",
        scope: ['profile', 'email'],
        responseType: "id_token token",
        endpoints: {
          token: `http://localhost:3000/google`,
          userInfo: `http://localhost:3000/google`
        },
      },
    },
  },

  i18n: {
    locales: [
      { code: "en", iso: "en-US", file: "en.js", name: "English" },
      { code: "it", iso: "it-IT", file: "it.js", name: "Italiano" },
    ],
    langDir: "locales",
    defaultLocale: "en",
    vueI18n: {
      fallbackLocale: "en",
    },
  },

  axios: {
    baseURL: "http://localhost:4000", // Used as fallback if no runtime config is provided
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
