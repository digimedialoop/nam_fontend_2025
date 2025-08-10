<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHtmlConverter } from '~/composables/useHtmlConverter'
import Disclaimer from '~/components/Disclaimer.vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.link as string

const token = useRuntimeConfig().public.strapiToken
const url = useRuntimeConfig().public.strapiUrl

const { convertToHTML } = useHtmlConverter()

const article = ref(null)
const error = ref(null)

async function fetchArticle() {
  try {
    const res = await $fetch(`${url}/api/articles`, {
      params: {
        'filters[slug][$eq]': slug,
        populate: '*'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.data && res.data.length > 0) {
      article.value = res.data[0]
    } else {
      throw createError({ statusCode: 404, statusMessage: 'Artikel nicht gefunden' })
    }
  } catch (e) {
    error.value = e
  }
}

await fetchArticle()

// Auf Änderungen des Slugs reagieren
watch(() => route.params.slug, async (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    slug = newSlug as string
    article.value = null
    error.value = null
    await fetchArticle()
  }
})

watch(error, (e) => {
  if (e) router.replace('/404')
})

const htmlContent = computed(() => {
  if (!article.value?.content) return ''
  return convertToHTML(article.value.content) // content ist direkt Array
})

watch(article, (art) => {
  if (!art) return
  useHead({
    title: art.title ?? 'Artikel',
    meta: [
      { name: 'description', content: art.teaser ?? '' },
      { property: 'og:title', content: art.title ?? '' },
      { property: 'og:description', content: art.teaser ?? '' },
      { property: 'og:image', content: getImageUrl(art.image) },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'keywords', content: 'Fermentieren Anleitung, Probiotika, Darmgesundheit' }
    ],
    link: [
      { rel: 'canonical', href: `https://www.naturamentalis.de/magazin/artikel/${art.slug ?? ''}` }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: art.title ?? '',
          description: art.teaser ?? '',
          image: getImageUrl(art.image),
          author: { '@type': 'Person', name: art.author ?? 'Autor' },
          datePublished: art.publishdate ?? '',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.naturamentalis.de/magazin/artikel/${art.slug ?? ''}`
          }
        })
      }
    ],
    htmlAttrs: { lang: 'de' }
  })
})

function getImageUrl(imageArray) {
  // image ist Array, nimm erstens Bild und seine URL
  if (!imageArray?.length) return ''
  const img = imageArray[0]
  return img?.url ? url + img.url : ''
}
</script>

<template>
  <section v-if="article" class="article">
    <div class="imageBox" v-if="article.image?.length">
      <img :src="getImageUrl(article.image)" :alt="article.title ?? ''" />
    </div>
    <div class="container">
      <h1>{{ article.title ?? 'Ohne Titel' }}</h1>
      <p class="info">
        <b>Autor</b> {{ article.author ?? 'Sabrina Hennrich' }} |
        <b>Veröffentlicht</b>
        {{
          article.publishdate
            ? new Date(article.publishdate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'unbekannt'
        }}
      </p>
      <p class="teaser">{{ article.teaser ?? '' }}</p>

      <div v-html="htmlContent"></div>

      <div v-if="article.ads?.length" class="ads">
        <div v-for="(ad, idx) in article.ads" :key="idx" class="ad">
          Anzeige: {{ ad }}
        </div>
      </div>
      <Disclaimer />
    </div>
  </section>

  <p v-else-if="error">Artikel nicht gefunden.</p>
  <p v-else>Lädt...</p>
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
