// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Nuxt 4 uses nitro for the server engine
  nitro: {
    experimental: {
      websocket: true
    }
  }
})
