<script setup lang="ts">
import { useRoute } from 'vue-router'
import { articles, type Article } from '~/utils/articles'
import MarkdownIt from 'markdown-it'
import { ref, computed } from 'vue'
import Disclaimer from '~/components/Disclaimer.vue'

const route = useRoute()
const md = new MarkdownIt()

const link = route.params.link as string

const article = ref<Article | undefined>(articles.find(a => a.link === link))

if (!article.value) {
  // Nuxt 3: Fehlerseite anzeigen
  throw createError({ statusCode: 404, statusMessage: 'Artikel nicht gefunden' })
}

// SEO Meta
useHead({
  title: article.value.title,
  meta: [
    { name: 'description', content: article.value.teaser },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.teaser },
    { property: 'og:image', content: article.value.image },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'keywords', content: 'Fermentieren Anleitung, Probiotika, Darmgesundheit' }
  ],
  link: [
    { rel: 'canonical', href: `https://www.naturamentalis.de/magazin/artikel/${article.value.link}` }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.value.title,
        description: article.value.teaser,
        image: article.value.image,
        author: { '@type': 'Person', name: article.value.author },
        datePublished: article.value.publishDate,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.naturamentalis.de/magazin/artikel/${article.value.link}`
        }
      })
    }
  ],
  htmlAttrs: { lang: 'de' }
})

const htmlContent = computed(() => md.render(article.value?.content || ''))
</script>

<template>
  <section class="article" v-if="article">
    <div class="imageBox">
      <img :src="article.image" :alt="article.title" />
    </div>
    <div class="container">
      <h1>{{ article.title }}</h1>
      <p class="info"><b>Autor</b> {{ article.author }} | <b>Veröffentlicht</b> {{ new Date(article.publishDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
      <p class="teaser">{{ article.teaser }}</p>

      <div v-html="htmlContent"></div>

      <!-- Ads rendern -->
      <div v-if="article.ads.length" class="ads">
        <div v-for="ad in article.ads" :key="ad" class="ad">
          <!-- Beispielanzeige -->
          Anzeige: {{ ad }}
        </div>
      </div>
      <Disclaimer />
    </div>
  </section>
</template>

<style lang="sass">
.article
  overflow-X: hidden
  width: 100%
  h1
    color: darken($gold, 30%)
    line-height: 120%
  h2
    color: darken($green, 30%)
    margin: 2.5rem 0 .5rem
    font-family: 'Laila'
  h3
    color: darken($red, 30%)
    margin: 2.5rem 0 .5rem
    font-family: 'Laila'
  
  p, li
    line-height: 140%
    font-size: 1.2rem
    &.teaser
      font-family: 'Mainfont-Bold'
      font-size: 1.4rem
    a
      color: darken($gold, 30%)
      text-decoration: underline

  .imageBox
    float: right
    width: 500px
    max-width: 50vw
    height: auto
    margin: 0 0 2rem 2rem
    position: relative
    @media (max-width: $breakpointMD)
      max-width: 95%
    &::before
      content: ''
      width: 100%
      height: 100%
      background-image: url('/assets/images/ImageBGshape.svg')
      background-repeat: no-repeat
      background-size: contain
      background-position: top right
      position: absolute
      top: 0
      right: -25%
      z-index: 1
      transform: scale(-1)
    img
      width: 90%
      border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%
      z-index: 2
      border: 8px solid $gold
      position: relative
      margin-top: 20%


</style>
