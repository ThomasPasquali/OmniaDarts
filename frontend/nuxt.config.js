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
        responseType: "code",
        endpoints: {
          token: "http://localhost:4000/user/google/", // somm backend url to resolve your auth with google and give you the token back
          userInfo: "http://localhost:4000/auth/user/", // the endpoint to get the user info after you recived the token
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
