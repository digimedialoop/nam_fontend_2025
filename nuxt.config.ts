export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxtjs/sitemap'],
  sitemap: {
    hostname: 'https://www.naturamentis.de',
    exclude: ['/impressum', '/datenschutz'],
  },
  nitro: {
    preset: 'vercel'
  },
  target: 'static',
  app: {
    head: {
      title: 'naturamentis',
      titleTemplate: '%s - naturamentis',
      htmlAttrs: {
        lang: 'de',
      },
      meta: [
        { name: 'description', content: 'Naturamentis – Ganzheitliche Informationen für mehr Balance und Wohlbefinden von Körper, Geist und Seele. Entdecke Wissen zu Heilpflanzen, Lebensweise und natürlichen Heilmethoden' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'naturamentis' },
        { property: 'og:description', content: 'Naturamentis – Ganzheitliche Informationen für mehr Balance und Wohlbefinden von Körper, Geist und Seele. Entdecke Wissen zu Heilpflanzen, Lebensweise und natürlichen Heilmethoden' },
        { property: 'og:url', content: 'https://www.naturamentis.de' },
        { property: 'og:image', content: 'https://www.naturamentis.de/assets/images/NAM_Logo.svg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'naturamentis' },
        { name: 'twitter:description', content: 'Naturamentis – Ganzheitliche Informationen für mehr Balance und Wohlbefinden von Körper, Geist und Seele. Entdecke Wissen zu Heilpflanzen, Lebensweise und natürlichen Heilmethoden' },
        { name: 'twitter:image', content: 'https://www.naturamentis.de/assets/images/NAM_Logo.svg' }
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
