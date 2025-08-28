<template>
  <div class="adBox" v-if="bookData">
    <img :src="coverUrl" :alt="bookData.title ?? 'Buchcover'" />
    <h3>{{ bookData.title }}*</h3>
    <a 
      :href="`https://www.amazon.de/dp/${bookData.asin}?tag=${affiliateTag}`" 
      target="_blank" 
      rel="noopener noreferrer"
      class="btn">
      Jetzt ansehen
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const affiliateTag = 'naturamentali-21'

const props = defineProps<{ 
  book: { 
    id: number; 
    title?: string; 
    asin?: string;
  } 
}>()

const bookData = ref<{ title?: string; asin?: string; cover?: any } | null>(null)
const coverUrl = ref('/assets/images/placeholder.jpeg')

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl
const token = config.public.strapiToken

async function fetchBookByAsin(asin: string) {
  try {
    const res = await $fetch(`${strapiUrl}/api/books`, {
      params: {
        'filters[asin][$eq]': asin,
        'populate': 'cover'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.data && res.data.length > 0) {
      const book = res.data[0]
      const coverData = book.attributes?.cover?.data

      if (coverData) {
        const coverEntries = Array.isArray(coverData) ? coverData : [coverData]
        const firstCover = coverEntries[0]
        const url = firstCover.attributes?.url

        if (url) {
          coverUrl.value = `${strapiUrl}${url}`
          bookData.value = {
            ...props.book,
            title: book.attributes.title,
            asin: book.attributes.asin
          }
          return true
        }
      }
    }

    return false
  } catch (e) {
    console.error('Fehler in fetchBookByAsin:', e)
    return false
  }
}

// Alternative: Noch spezifischere Populate-Syntax für Multiple Media
async function fetchBookWithDetailedCover(asin: string) {
  try {
    

    const res = await $fetch(`${strapiUrl}/api/books`, {
      params: {
        'filters[asin][$eq]': asin,
        'populate': '*', // Einfach alles populieren
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    

    if (res.data && res.data.length > 0) {
      
      const bookAttributes = res.data[0]
      

      // cover ist: { data: [...] }
      const coverData = bookAttributes.cover

      if (Array.isArray(coverData) && coverData.length > 0) {
        const firstCover = coverData[0]
        const coverUrlAttr = firstCover

        // Priorisiere kleines Format für Performance
        const imageUrl = 
          coverUrlAttr.formats?.thumbnail?.url ||
          coverUrlAttr.url

        if (imageUrl) {
          coverUrl.value = `${strapiUrl}${imageUrl}`
          
          return true
        }
      }
    }

    console.warn('Kein Cover in Strapi-Daten gefunden')
    return false
  } catch (e) {
    console.error('Fehler bei detaillierter Cover-Suche', e)
    return false
  }
}

onMounted(() => {
    
  bookData.value = props.book
  
  if (props.book?.asin) {
    // Erst normale Suche, dann detaillierte
    fetchBookByAsin(props.book.asin).then(success => {
      if (!success && props.book?.asin) {
        fetchBookWithDetailedCover(props.book.asin)
      }
    })
  }
})

watch(() => props.book, (newBook) => {
  console.log('Buch geändert:', newBook)
  bookData.value = newBook
  if (newBook?.asin) {
    fetchBookByAsin(newBook.asin).then(success => {
      if (!success && newBook?.asin) {
        fetchBookWithDetailedCover(newBook.asin)
      }
    })
  }
})
</script>

<style lang="sass">
.adBox
  background-color: lighten($gold, 15%)
  padding: 2rem
  margin: 0
  text-align: center
  border-radius: 1rem
  width: 90%
  max-width: 320px
  img
    width: 80%
    max-width: 160px
    margin-bottom: 1rem
  h3
    margin: 0 1rem 1rem 1rem !important
    padding: 0
  .btn
    display: inline-block
    background-color: darken($gold, 10%)
    color: white
    padding: 0.8rem 1.4rem
    border-radius: 5px
    text-decoration: none
    text-transform: uppercase
    font-family: 'Mainfont-Bold'
    font-size: 1.3rem
</style>