// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-09-27',

  // https://www.joshwcomeau.com/css/custom-css-reset/
  css: [
    "@/assets/styles/reset.css",
    "@/assets/styles/base.css",
    "@/assets/styles/mixins.css",
    "@/assets/styles/theme.css",
    "@/assets/styles/layouts/layout.css",
    "@/assets/styles/components/buttons.css",
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:4000",
    },
  },
});
