<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AmazonAd from '~/components/AmazonAd.vue'
import ArticleCarousel from '~/components/ArticleCarousel.vue'

const route = useRoute()
const router = useRouter()
const link = route.params.link as string

const token = useRuntimeConfig().public.strapiToken
const url = useRuntimeConfig().public.strapiUrl

const { convertToHTML } = useHtmlConverter()

const article = ref(null)

async function fetchArticle(slug: string) {
  try {
    const res = await $fetch(`${url}/api/articles`, {
      params: {
        'filters[slug][$eq]': slug,
        'populate': '*'
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
    throw e // Nuxt zeigt 404 automatisch, kein manuelles Routing nötig
  }
}

// Direkt laden
await fetchArticle(link)

// HTML Content als computed - mit Werbeplatz-Platzhalter
const htmlContent = computed(() => {
  if (!article.value?.content) return ''
  // Füge Werbeplatz-Platzhalter ein, wenn mindestens 2 Werbeprodukte vorhanden sind
  const shouldInsertAd = article.value.Werbeprodukte?.length >= 2
  return convertToHTML(article.value.content, undefined, shouldInsertAd)
})

// Reactive state für teleport
const teleportReady = ref(false)
const teleportTarget = ref('')

// Funktion zum Ersetzen der Werbeplätze nach dem Mount
const replaceAdPlaceholders = async () => {
  // Warte auf DOM Update
  await nextTick()
  
  const placeholders = document.querySelectorAll('.adPlaceholder[data-ad-position="middle"]')
  
  placeholders.forEach((placeholder) => {
    if (article.value?.Werbeprodukte?.length >= 2) {
      // Verwende eine eindeutige ID basierend auf der Artikel-ID
      const uniqueId = `middle-ad-container-${article.value.id}`
      placeholder.setAttribute('id', uniqueId)
      teleportTarget.value = `#${uniqueId}`
      
      // Warte nochmal kurz und aktiviere dann teleport
      setTimeout(() => {
        teleportReady.value = true
      }, 50)
    } else {
      // Entferne den Platzhalter, wenn keine Werbung vorhanden
      placeholder.remove()
    }
  })
}

// Watch für Route-Änderungen (über den link parameter)
watch(() => route.params.link, () => {
  teleportReady.value = false
  teleportTarget.value = ''
}, { immediate: true })

// Setze teleportReady bei jedem neuen Artikel zurück
watch(() => article.value?.id, () => {
  teleportReady.value = false
  teleportTarget.value = ''
}, { immediate: true })

// Warte auf DOM-Update und ersetze Platzhalter
onMounted(() => {
  replaceAdPlaceholders()
})

// Auch bei Content-Änderungen
watchEffect(() => {
  if (article.value?.content) {
    replaceAdPlaceholders()
  }
})

// SEO Meta automatisch aktualisieren mit watchEffect
watchEffect(() => {
  if (!article.value) return

  const art = article.value

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
      
      <!-- Erstes Werbeprodukt -->
      <div v-if="article.books?.length" class="firstAd">
        <AmazonAd 
          :book="article.books[0]"
        />
      </div>

      <!-- Content mit dynamisch eingefügten Werbeplätzen -->
      <div class="contentBox" v-html="htmlContent"></div>
      
      <!-- Komponente für mittlere Werbung (wird nach dem Mount eingefügt) -->
      <teleport :to="teleportTarget" v-if="teleportReady && teleportTarget && article.books?.length >= 2">
        <AmazonAd 
          :book="article.books[1]"
        />
      </teleport>

      <Disclaimer />

      <section class="adDisclaimer" v-if="article.books?.length > 1">
        <p><b>Info</b><span>*</span> Wir nehmen am Amazon-Partnerprogramm teil. Durch die Nutzung unserer Links kannst du unsere Arbeit unterstützen. (Es entstehen für dich keine Mehrkosten)</p>
      </section>

      <!-- Verwandte Artikel Karussell -->
      <ArticleCarousel 
        :current-article-categories="article.articlecategories || []"
        :current-article-id="article.id"
        v-if="article.articlecategories?.length"
      />
    </div>
  </section>

  <p v-else-if="error">Artikel nicht gefunden.</p>
  <p v-else>Lädt...</p>
</template>

<style lang="sass">
.article
  overflow-X: hidden
  width: 100%
  position: relative

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
  
  .firstAd
    float: left
    margin: 1rem 5vw 2rem 0
    @media (max-width: $breakpointMD)
      float: none
      margin: 1rem auto
      
  
  .adPlaceholder
    margin: 1rem 0 2rem 5vw
    float: right
    @media (max-width: $breakpointMD)
      float: none
      margin: 1rem auto
    
  .contentBox
    ul, ol
      list-style-position: inside    
      margin-left: 0
      padding-left: 0
      display: block
      margin-block-start: 1em
      margin-block-end: 1em
      padding-inline-start: 0
      li
        padding-left: 2rem
        
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

  .adDisclaimer
    background-color: lighten($gold, 16%)
    padding: .2rem 1rem
    border-radius: 1rem
    p
      font-size: 1rem
</style>