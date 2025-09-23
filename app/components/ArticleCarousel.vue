<template>
  <div class="article-carousel" v-if="relatedArticles.length > 0 || mode === 'latest'">
    <h2>{{ title }}</h2>
    
    <div class="carousel-container">
      <button 
        class="carousel-btn carousel-btn--left" 
        @click="scrollLeft"
        :disabled="!canScrollLeft"
      >
        ‹
      </button>
      
      <div 
        class="carousel-wrapper" 
        ref="carouselWrapper"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div 
          class="carousel-track" 
          ref="carouselTrack"
          :style="{ transform: `translateX(-${currentOffset}px)` }"
        >
          <div
            v-for="article in infiniteArticles"
            :key="`${article.id}-${article.duplicateIndex || 0}`"
            class="articleBox"
            :class="`articleBox--${size}`"
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

type BoxSize = 'S' | 'M' | 'L' | 'XL'
type FetchMode = 'categories' | 'latest'

interface Props {
  currentArticleCategories?: Array<{ category: string }>
  currentArticleId?: number
  size?: BoxSize
  title?: string
  mode?: FetchMode
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'M',
  title: 'Noch mehr Inspiration für deinen persönlichen Wohlfühlmoment',
  mode: 'categories',
  count: 12
})

const token = useRuntimeConfig().public.strapiToken
const url = useRuntimeConfig().public.strapiUrl

// Size configurations
const sizeConfig = {
  S: {
    desktop: { width: 140, gap: 15, height: 100 },
    tablet: { width: 125, gap: 10, height: 110 },
    mobile: { width: 110, gap: 8, height: 100 }
  },
  M: {
    desktop: { width: 280, gap: 20, height: 180 },
    tablet: { width: 250, gap: 15, height: 160 },
    mobile: { width: 220, gap: 15, height: 150 }
  },
  L: {
    desktop: { width: 373, gap: 25, height: 240 }, // ~1/3 größer
    tablet: { width: 333, gap: 20, height: 213 },
    mobile: { width: 293, gap: 18, height: 200 }
  },
  XL: {
    desktop: { width: 560, gap: 30, height: 360 }, // doppelt so groß
    tablet: { width: 500, gap: 25, height: 320 },
    mobile: { width: 440, gap: 20, height: 300 }
  }
}

// Reactive data
const relatedArticles = ref<Article[]>([])
const infiniteArticles = ref<Article[]>([])
const currentOffset = ref(0)
const carouselWrapper = ref<HTMLElement>()
const carouselTrack = ref<HTMLElement>()
const itemWidth = ref(300)
const visibleItems = ref(3)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const maxOffset = ref(0)

// Touch handling
const touchStartX = ref(0)
const touchCurrentX = ref(0)
const isDragging = ref(false)
const startOffset = ref(0)

// Get current size config based on screen size
const getCurrentSizeConfig = () => {
  if (!process.client) return sizeConfig[props.size].desktop
  
  const width = window.innerWidth
  if (width <= 480) return sizeConfig[props.size].mobile
  if (width <= 768) return sizeConfig[props.size].tablet
  return sizeConfig[props.size].desktop
}

// Fetch related articles
const fetchRelatedArticles = async () => {
  try {
    let params: Record<string, any> = {
      populate: '*',
      'sort[0]': 'publishdate:desc'
    }

    if (props.mode === 'categories') {
      // Categories Mode - benötigt currentArticleCategories und currentArticleId
      if (!props.currentArticleCategories?.length) {
        console.warn('Categories mode requires currentArticleCategories')
        return
      }

      // Aktuellen Artikel ausschließen
      if (props.currentArticleId) {
        params['filters[id][$ne]'] = props.currentArticleId
      }

      // Kategorie-Filter hinzufügen
      const categoryParams = props.currentArticleCategories.reduce((acc, cat, index) => {
        acc[`filters[articlecategories][category][$in][${index}]`] = cat.category
        return acc
      }, {} as Record<string, string>)

      params = { ...params, ...categoryParams }

    } else if (props.mode === 'latest') {
      // Latest Mode - einfach die neuesten Artikel
      params['pagination[limit]'] = props.count

      // Optional: aktuellen Artikel ausschließen
      if (props.currentArticleId) {
        params['filters[id][$ne]'] = props.currentArticleId
      }
    }

    const res = await $fetch(`${url}/api/articles`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    relatedArticles.value = res.data || []
    createInfiniteArray()
    calculateDimensions()
  } catch (error) {
    console.error('Fehler beim Laden der Artikel:', error)
  }
}

// Erstelle ein unendliches Array durch Duplizierung
const createInfiniteArray = () => {
  if (relatedArticles.value.length === 0) return

  const articles = relatedArticles.value
  const minItems = Math.max(20, articles.length * 3)
  
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

// Berechne Dimensionen und sichtbare Items
const calculateDimensions = () => {
  if (!carouselWrapper.value) return
  
  const containerWidth = carouselWrapper.value.offsetWidth
  const config = getCurrentSizeConfig()
  
  itemWidth.value = config.width + config.gap
  visibleItems.value = Math.floor(containerWidth / itemWidth.value)
  visibleItems.value = Math.max(1, Math.min(visibleItems.value, relatedArticles.value.length))
  
  maxOffset.value = (infiniteArticles.value.length - visibleItems.value) * itemWidth.value
  
  updateScrollButtons()
}

// Touch event handlers
const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length !== 1) return
  
  touchStartX.value = e.touches[0].clientX
  startOffset.value = currentOffset.value
  isDragging.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length !== 1) return
  
  e.preventDefault()
  touchCurrentX.value = e.touches[0].clientX
  const deltaX = touchStartX.value - touchCurrentX.value
  
  const newOffset = startOffset.value + deltaX
  const minOffset = -itemWidth.value * 0.5
  const maxDragOffset = maxOffset.value + itemWidth.value * 0.5
  
  currentOffset.value = Math.max(minOffset, Math.min(maxDragOffset, newOffset))
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  
  const deltaX = touchStartX.value - touchCurrentX.value
  const threshold = itemWidth.value * 0.2
  
  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0) {
      scrollRight()
    } else {
      scrollLeft()
    }
  } else {
    currentOffset.value = startOffset.value
  }
}

// Scroll-Funktionen
const scrollLeft = () => {
  const newOffset = currentOffset.value - itemWidth.value
  
  if (newOffset < 0) {
    const itemsToShow = Math.min(relatedArticles.value.length, visibleItems.value)
    const endPosition = maxOffset.value - (itemsToShow * itemWidth.value)
    currentOffset.value = Math.max(0, endPosition)
  } else {
    currentOffset.value = newOffset
  }
  
  updateScrollButtons()
}

const scrollRight = () => {
  const newOffset = currentOffset.value + itemWidth.value
  
  if (newOffset >= maxOffset.value - (relatedArticles.value.length * itemWidth.value)) {
    currentOffset.value = 0
  } else {
    currentOffset.value = newOffset
  }
  
  updateScrollButtons()
}

const updateScrollButtons = () => {
  const hasEnoughArticles = infiniteArticles.value.length > visibleItems.value
  canScrollLeft.value = hasEnoughArticles
  canScrollRight.value = hasEnoughArticles
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
    calculateDimensions()
    
    let resizeTimeout: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(calculateDimensions, 150)
    }
    
    window.addEventListener('resize', debouncedResize)
    
    onUnmounted(() => {
      window.removeEventListener('resize', debouncedResize)
    })
  })
})

// Watch für Props-Änderungen
watch(() => [props.currentArticleCategories, props.mode, props.count], () => {
  fetchRelatedArticles()
}, { deep: true })

watch(() => props.size, () => {
  nextTick(calculateDimensions)
})
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
  touch-action: pan-y

.carousel-track
  display: flex
  transition: transform 0.3s ease
  will-change: transform

// Base articleBox styles
.articleBox
  flex-shrink: 0
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
    object-fit: cover
    border-radius: 0.6rem 0.6rem 0 0
    display: block
  
  .subtitle
    color: darken($gold, 30%)
    margin: 0.5rem .5rem !important
    line-height: 1rem
  
  h3
    font-family: 'Laila', sans-serif
    margin: 0 .5rem 1rem .5rem !important
    padding-bottom: 1rem
    color: black
    flex-grow: 1

// Size variations - Desktop
.articleBox--S
  width: 140px
  margin-right: 15px
  
  img
    height: 120px
  
  .subtitle
    font-size: 0.75rem
    margin: 0.4rem 0
  
  h3
    font-size: 0.85rem !important
    margin: 0 0.5rem 0.8rem
    padding-bottom: 0.8rem

.articleBox--M
  width: 280px
  margin-right: 20px
  
  img
    height: 180px
  
  .subtitle
    font-size: 0.9rem
    margin: 0.5rem 0
  
  h3
    font-size: 1.1rem
    margin: 0 1rem 1rem
    padding-bottom: 1rem

.articleBox--L
  width: 373px
  margin-right: 25px
  
  img
    height: 240px
  
  .subtitle
    font-size: 1rem
    margin: 0.6rem 0
  
  h3
    font-size: 1.3rem
    margin: 0 1.2rem 1.2rem
    padding-bottom: 1.2rem

.articleBox--XL
  width: 560px
  margin-right: 30px
  
  img
    height: 360px
  
  .subtitle
    font-size: 1.1rem
    margin: 0.7rem 0
  
  h3
    font-size: 1.5rem
    margin: 0 1.5rem 1.5rem
    padding-bottom: 1.5rem

// Tablet responsive (768px and below)
@media (max-width: 768px)
  .carousel-btn
    width: 40px
    height: 40px
    font-size: 20px
  
  .articleBox--S
    width: 125px
    margin-right: 10px
    
    img
      height: 110px
    
    .subtitle
      font-size: 0.7rem
    
    h3
      font-size: 0.8rem

  .articleBox--M
    width: 250px
    margin-right: 15px
    
    img
      height: 160px
    
    .subtitle
      font-size: 0.85rem
    
    h3
      font-size: 1rem

  .articleBox--L
    width: 333px
    margin-right: 20px
    
    img
      height: 213px
    
    .subtitle
      font-size: 0.95rem
    
    h3
      font-size: 1.2rem

  .articleBox--XL
    width: 500px
    margin-right: 25px
    
    img
      height: 320px
    
    .subtitle
      font-size: 1.05rem
    
    h3
      font-size: 1.4rem

// Mobile responsive (480px and below)
@media (max-width: 480px)
  .carousel-container
    gap: 0.5rem
  
  .carousel-btn
    width: 35px
    height: 35px
    font-size: 18px
  
  .articleBox--S
    width: 110px
    margin-right: 8px
    
    img
      height: 100px
    
    .subtitle
      font-size: 0.65rem
      margin: 0.3rem 0
    
    h3
      font-size: 0.75rem
      margin: 0 0.4rem 0.6rem
      padding-bottom: 0.6rem

  .articleBox--M
    width: 220px
    margin-right: 15px
    
    img
      height: 150px
    
    .subtitle
      font-size: 0.8rem
    
    h3
      font-size: 0.95rem

  .articleBox--L
    width: 293px
    margin-right: 18px
    
    img
      height: 200px
    
    .subtitle
      font-size: 0.9rem
    
    h3
      font-size: 1.1rem

  .articleBox--XL
    width: 440px
    margin-right: 20px
    
    img
      height: 300px
    
    .subtitle
      font-size: 1rem
    
    h3
      font-size: 1.3rem
</style>