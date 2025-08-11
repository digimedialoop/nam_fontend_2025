import { plants } from './app/utils/medPlants'

// Generiere die Routes dynamisch aus den Pflanzen-Daten
const medPlantRoutes = plants.map(plant => `/heilpflanze/${plant.slug}`)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      strapiUrl: process.env.STRAPI_URL,
      strapiToken: process.env.STRAPI_TOKEN
    }
  },
  sitemap: {
    hostname: 'https://www.naturamentalis.de',
    exclude: ['/impressum', '/datenschutz'],
    defaults: {
      lastmod: new Date().toISOString(),
      priority: 0.5,
      changefreq: 'weekly'
    }
  },
  nitro: {
    preset: 'vercel',
    prerender: {
      routes: [
        ...medPlantRoutes,
        // Weitere statische Routes können hier hinzugefügt werden
      ]
    }
  },
  //target: 'static', For SSG
  app: {
    head: {
      title: 'naturamentalis',
      titleTemplate: '%s - naturamentalis',
      htmlAttrs: {
        lang: 'de',
      },
      meta: [
        { name: 'description', content: 'naturamentalis – Ganzheitliche Informationen für mehr Balance und Wohlbefinden von Körper, Geist und Seele. Entdecke Wissen zu Heilpflanzen, Lebensweise und natürlichen Heilmethoden' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'naturamentalis' },
        { property: 'og:description', content: 'naturamentalis – Ganzheitliche Informationen für mehr Balance und Wohlbefinden von Körper, Geist und Seele. Entdecke Wissen zu Heilpflanzen, Lebensweise und natürlichen Heilmethoden' },
        { property: 'og:url', content: 'https://www.naturamentalis.de' },
        { property: 'og:image', content: 'https://www.naturamentalis.de/assets/images/NAM_Logo.svg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'naturamentalis' },
        { name: 'twitter:description', content: 'naturamentalis – Ganzheitliche Informationen für mehr Balance und Wohlbefinden von Körper, Geist und Seele. Entdecke Wissen zu Heilpflanzen, Lebensweise und natürlichen Heilmethoden' },
        { name: 'twitter:image', content: 'https://www.naturamentalis.de/assets/images/NAM_Logo.svg' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  css: ['@/assets/styles/main.sass'],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@use "@/assets/styles/variables.sass" as *\n`
        }
      }
    }
  }
})
