<template>
  <div class="container">
    <h1>Wohlfühlmagazin</h1>
    <h2>
      Im Garten des Wissens gedeihen Gedanken und Erfahrungen,
      die deinen Körper, Geist und Seele nähren.
    </h2>

    <!-- Kategorie Filter -->
    <div class="categoryFilter">
      <button 
        class="categoryChip"
        :class="{ active: selectedCategory === null }"
        @click="selectCategory(null)"
      >
        Alle ({{ totalArticleCount }})
      </button>
      
      <button 
        v-for="category in categoriesWithCount"
        :key="category.name"
        class="categoryChip"
        :class="{ active: selectedCategory === category.name }"
        @click="selectCategory(category.name)"
      >
        {{ category.name }} ({{ category.count }})
      </button>
    </div>

    <!-- Artikel Liste -->
    <div class="articleList">
      <div
        v-for="article in paginatedArticles"
        :key="article.link || article.id"
        class="articleBox"
      >
        <NuxtLink :to="`/magazin/artikel/${article.slug || ''}`">
          <img
            :src="getImage(article)"
            :alt="getAlt(article)"
          />
          <p class="subtitle">
            {{ article.randomCategory }}
          </p>
          <h3>{{ article.title }}</h3>
        </NuxtLink>
      </div>

      <div v-if="!filteredArticles?.length && articles?.data?.length">
        <p>Keine Artikel in dieser Kategorie gefunden.</p>
      </div>

      <div v-if="!articles?.data?.length">
        <p>Hopala - wir mussten leider unser System kurz runterfahren.</p>
        <p>Wenn du magst, kannst du aber gerne später wieder vorbei schauen.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="paginationBtn"
        :class="{ disabled: currentPage === 1 }"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        ‹ Zurück
      </button>
      
      <button
        v-for="page in visiblePages"
        :key="page"
        class="paginationBtn pageNumber"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      
      <button 
        class="paginationBtn"
        :class="{ disabled: currentPage === totalPages }"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Weiter ›
      </button>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Wohlfühlmagazin für Körper und Seele - naturamentalis Magazin',
  description:
    'Artikel rund um die Themen: Körper, Gesundheit, Vitalität, Achtsamkeit, Innere Balance, Kreativität, Inspiration, Kulinarik und Natur. ',
})

const token = useRuntimeConfig().public.strapiToken
const url = useRuntimeConfig().public.strapiUrl

// Reactive state
const selectedCategory = ref(null)
const currentPage = ref(1)
const articlesPerPage = 10

const { data: articles, error, pending } = await useFetch(
  `${url}/api/articles?populate=*&sort[0]=publishdate:desc`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    //async: true, // bing kann sonst nicht indexieren, weil es SSR blockiert
  }
)

// Berechne Kategorien mit Anzahl
const categoriesWithCount = computed(() => {
  if (!articles.value?.data) return []
  
  const categoryMap = new Map()
  
  articles.value.data.forEach(article => {
    if (article.articlecategories) {
      article.articlecategories.forEach(cat => {
        const categoryName = cat.category
        if (categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, categoryMap.get(categoryName) + 1)
        } else {
          categoryMap.set(categoryName, 1)
        }
      })
    }
  })
  
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

// Gesamtanzahl der Artikel
const totalArticleCount = computed(() => {
  return articles.value?.data?.length || 0
})

// Gefilterte Artikel basierend auf ausgewählter Kategorie
const articlesWithRandomCategory = computed(() => {
  return articles.value?.data.map(article => {
    return {
      ...article,
      randomCategory: article.articlecategories?.length 
        ? article.articlecategories[Math.floor(Math.random() * article.articlecategories.length)].category
        : ''
    }
  }) || []
})

const filteredArticles = computed(() => {
  if (!selectedCategory.value) return articlesWithRandomCategory.value
  return articlesWithRandomCategory.value.filter(article =>
    article.articlecategories?.some(cat => cat.category === selectedCategory.value)
  )
})

// Paginierte Artikel
const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  return filteredArticles.value.slice(startIndex, endIndex)
})

// Gesamtanzahl Seiten
const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / articlesPerPage)
})

// Sichtbare Seiten für Pagination
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // Zeige alle Seiten wenn weniger als 7
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Intelligente Seitenauswahl
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Methoden
const selectCategory = (category) => {
  selectedCategory.value = category
  currentPage.value = 1 // Reset auf erste Seite bei Kategorie-Wechsel
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll nach oben
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Utility functions
const getRandomCategory = (categories) => {
  if (!categories || categories.length === 0) return ''
  const randomIndex = Math.floor(Math.random() * categories.length)
  return categories[randomIndex].category
}

const getImage = (article) => {
  if (article?.image?.[0]?.url) {
    return url + article.image[0].url
  }
  return '/images/fallback.jpg'
}

const getAlt = (article) => {
  if (article?.image?.[0]?.alternativeText) {
    return article.image[0].alternativeText
  }
  return article?.title || 'Artikelbild'
}
</script>

<style lang="sass">
.categoryFilter
  margin: 2rem 0 3rem 0
  display: flex
  flex-wrap: wrap
  gap: 0.8rem
  
.categoryChip
  background-color: white
  border: 2px solid lighten($gold, 20%)
  border-radius: 2rem
  padding: 0.6rem 1.2rem
  font-size: 1.1rem
  font-weight: 500
  color: darken($gold, 30%)
  cursor: pointer
  transition: all 0.3s ease
  font-family: inherit
  
  &:hover
    background-color: lighten($gold, 25%)
    border-color: lighten($gold, 10%)
    transform: translateY(-2px)
    box-shadow: 0 4px 12px rgba(0,0,0,0.1)
  
  &.active
    background-color: darken($gold, 10%)
    border-color: darken($gold, 10%)
    color: white
    box-shadow: 0 4px 12px rgba(0,0,0,0.15)
  
  @media (max-width: 768px)
    font-size: 0.8rem
    padding: 0.5rem 1rem

.articleList
  margin: 3rem 0
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
  gap: 2rem

.articleBox
  background-color: white
  border: 1px solid lighten($gold, 10%)
  border-radius: 0.8rem
  box-shadow: 0 2px 8px rgba(0,0,0,0.1)
  cursor: pointer
  text-align: center
  transition: transform 0.2s ease
  display: flex
  flex-direction: column

  &:hover
    transform: translateY(-4px)

  img
    width: 100%
    height: 180px
    object-fit: cover
    border-radius: 0.6rem 0.6rem 0 0
    display: block

  .subtitle
    font-size: .9rem
    color: darken($gold, 30%)
    margin: 0.5rem 0

  h3
    font-family: 'Laila', sans-serif
    font-size: 1.1rem
    margin: 0 1rem 1rem
    padding-bottom: 1rem
    color: black
    flex-grow: 1

.pagination
  display: flex
  justify-content: center
  align-items: center
  gap: 0.5rem
  margin: 3rem 0
  flex-wrap: wrap
  
.paginationBtn
  background-color: white
  border: 2px solid lighten($gold, 20%)
  border-radius: 0.5rem
  padding: 0.6rem 1rem
  font-size: 1.2rem
  font-weight: 500
  color: darken($gold, 30%)
  cursor: pointer
  transition: all 0.3s ease
  min-width: 44px
  
  &:hover:not(.disabled)
    background-color: lighten($gold, 25%)
    border-color: lighten($gold, 10%)
    transform: translateY(-1px)
    box-shadow: 0 2px 8px rgba(0,0,0,0.1)
    color: darken($gold, 30%)
  
  &.active
    background-color: $gold
    border-color: $gold
    color: white
    box-shadow: 0 2px 8px rgba(0,0,0,0.15)
  
  &.disabled
    background-color: lighten($gold, 30%)
    border-color: lighten($gold, 30%)
    color: lighten($gold, 5%)
    cursor: not-allowed
    opacity: 0.6
  
  &.pageNumber
    border-radius: 50%
    width: 44px
    height: 44px
    padding: 0
    display: flex
    align-items: center
    justify-content: center
    font-family: 'Mainfont-Bold'
  
  @media (max-width: 768px)
    font-size: 0.8rem
    padding: 0.5rem 0.8rem
    min-width: 40px
    
    &.pageNumber
      width: 40px
      height: 40px

// Responsive anpassungen
@media (max-width: 480px)
  .categoryFilter
    gap: 0.5rem
  
  .pagination
    gap: 0.3rem
</style>