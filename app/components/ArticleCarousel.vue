<template>
  <div class="article-carousel" v-if="relatedArticles.length > 0">
    <h2>Noch mehr Inspiration für deinen persönlichen Wohlfühlmoment</h2>
    
    <div class="carousel-container">
      <button 
        class="carousel-btn carousel-btn--left" 
        @click="scrollLeft"
        :disabled="!canScrollLeft"
      >
        ‹
      </button>
      
      <div class="carousel-wrapper" ref="carouselWrapper">
        <div 
          class="carousel-track" 
          ref="carouselTrack"
          :style="{ transform: `translateX(-${currentOffset}px)` }"
        >
          <div
            v-for="article in infiniteArticles"
            :key="`${article.id}-${article.duplicateIndex || 0}`"
            class="articleBox"
          >
            <NuxtLink :to="`/magazin/artikel/${article.slug || ''}`">
              <img
                :src="getImage(article)"
                :alt="getAlt(article)"
              />
              <p class="subtitle">
                {{ getRandomCategory(article.articlecategories) }}
              </p>
              <h3>{{ article.title }}</h3>
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <button 
        class="carousel-btn carousel-btn--right" 
        @click="scrollRight"
        :disabled="!canScrollRight"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Article {
  id: number
  title: string
  slug: string
  image?: Array<{ url: string; alternativeText?: string }>
  articlecategories?: Array<{ category: string }>
  duplicateIndex?: number
}

interface Props {
  currentArticleCategories: Array<{ category: string }>
  currentArticleId: number
}

const props = defineProps<Props>()

const token = useRuntimeConfig().public.strapiToken
const url = useRuntimeConfig().public.strapiUrl

// Reactive data
const relatedArticles = ref<Article[]>([])
const infiniteArticles = ref<Article[]>([])
const currentOffset = ref(0)
const carouselWrapper = ref<HTMLElement>()
const carouselTrack = ref<HTMLElement>()
const itemWidth = ref(300) // 280px + 20px gap
const visibleItems = ref(3)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

// Fetch related articles
const fetchRelatedArticles = async () => {
  if (!props.currentArticleCategories?.length) return

  try {
    // Erstelle Filter für alle Kategorien des aktuellen Artikels
    const categoryFilters = props.currentArticleCategories.map((cat, index) => 
      `filters[articlecategories][category][$in][${index}]=${encodeURIComponent(cat.category)}`
    ).join('&')

    const res = await $fetch(`${url}/api/articles`, {
      params: {
        populate: '*',
        'sort[0]': 'publishdate:desc',
        'filters[id][$ne]': props.currentArticleId, // Aktuellen Artikel ausschließen
        ...Object.fromEntries(
          props.currentArticleCategories.map((cat, index) => 
            [`filters[articlecategories][category][$in][${index}]`, cat.category]
          )
        )
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    relatedArticles.value = res.data || []
    createInfiniteArray()
  } catch (error) {
    console.error('Fehler beim Laden verwandter Artikel:', error)
  }
}

// Erstelle ein unendliches Array durch Duplizierung
const createInfiniteArray = () => {
  if (relatedArticles.value.length === 0) return

  const articles = relatedArticles.value
  const minItems = 20 // Mindestanzahl für flüssiges scrollen
  
  let duplicatedArticles: Article[] = []
  let duplicateIndex = 0
  
  while (duplicatedArticles.length < minItems) {
    articles.forEach(article => {
      duplicatedArticles.push({
        ...article,
        duplicateIndex: Math.floor(duplicateIndex / articles.length)
      })
      duplicateIndex++
    })
  }
  
  infiniteArticles.value = duplicatedArticles
}

// Berechne sichtbare Items basierend auf Container-Breite
const calculateVisibleItems = () => {
  if (!carouselWrapper.value) return
  
  const containerWidth = carouselWrapper.value.offsetWidth
  visibleItems.value = Math.floor(containerWidth / itemWidth.value)
  
  // Mindestens 1, maximal so viele wie Artikel vorhanden
  visibleItems.value = Math.max(1, Math.min(visibleItems.value, relatedArticles.value.length))
}

// Scroll-Funktionen
const scrollLeft = () => {
  if (!canScrollLeft.value) return
  
  const newOffset = currentOffset.value - itemWidth.value
  currentOffset.value = Math.max(0, newOffset)
  updateScrollButtons()
}

const scrollRight = () => {
  if (!canScrollRight.value) return
  
  const maxOffset = (infiniteArticles.value.length - visibleItems.value) * itemWidth.value
  const newOffset = currentOffset.value + itemWidth.value
  
  // Wenn wir fast am Ende sind, springe zum Anfang (unendlicher Loop)
  if (newOffset >= maxOffset - (relatedArticles.value.length * itemWidth.value)) {
    currentOffset.value = 0
  } else {
    currentOffset.value = newOffset
  }
  
  updateScrollButtons()
}

const updateScrollButtons = () => {
  canScrollLeft.value = currentOffset.value > 0
  canScrollRight.value = true // Immer true wegen unendlichem Loop
}

// Utility functions
const getImage = (article: Article) => {
  if (article?.image?.[0]?.url) {
    return url + article.image[0].url
  }
  return '/images/fallback.jpg'
}

const getAlt = (article: Article) => {
  if (article?.image?.[0]?.alternativeText) {
    return article.image[0].alternativeText
  }
  return article?.title || 'Artikelbild'
}

const getRandomCategory = (categories: Array<{ category: string }>) => {
  if (!categories || categories.length === 0) return ''
  const randomIndex = Math.floor(Math.random() * categories.length)
  return categories[randomIndex].category
}

// Lifecycle
onMounted(async () => {
  await fetchRelatedArticles()
  
  nextTick(() => {
    calculateVisibleItems()
    updateScrollButtons()
    
    // Resize listener
    window.addEventListener('resize', calculateVisibleItems)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateVisibleItems)
})

// Watch für Props-Änderungen
watch(() => props.currentArticleCategories, () => {
  fetchRelatedArticles()
}, { deep: true })
</script>

<style lang="sass" scoped>
.article-carousel
  margin: 3rem 0
  
  h2
    color: darken($gold, 30%)
    margin-bottom: 2rem
    font-family: 'Laila', sans-serif

.carousel-container
  position: relative
  display: flex
  align-items: center
  gap: 1rem
  padding-bottom: 1rem

.carousel-btn
  background-color: darken($gold, 10%)
  border: none
  border-radius: 50%
  width: 50px
  height: 50px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  font-size: 24px
  font-weight: bold
  color: white
  transition: all 0.2s ease
  flex-shrink: 0
  z-index: 2
  
  &:hover:not(:disabled)
    background-color: darken($gold, 20%)
    transform: scale(1.1)
  
  &:disabled
    background-color: lighten($gold, 20%)
    cursor: not-allowed
    opacity: 0.5

.carousel-wrapper
  overflow: hidden
  flex: 1
  position: relative

.carousel-track
  display: flex
  gap: 20px
  transition: transform 0.3s ease
  will-change: transform

.articleBox
  flex-shrink: 0
  width: 280px
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

// Responsive Design
@media (max-width: 768px)
  .carousel-btn
    width: 40px
    height: 40px
    font-size: 20px
  
  .articleBox
    width: 250px
  
  .carousel-track
    gap: 15px

@media (max-width: 480px)
  .carousel-container
    gap: 0.5rem
  
  .carousel-btn
    width: 35px
    height: 35px
    font-size: 18px
  
  .articleBox
    width: 220px
    
    img
      height: 150px
    
    h3
      font-size: 1rem
</style>