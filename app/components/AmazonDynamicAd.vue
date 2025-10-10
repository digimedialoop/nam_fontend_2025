<template>
  <div class="adBox" v-if="bookData">
    <img :src="bookData.imageUrl" :alt="bookData.title" />
    <h3>{{ bookData.title }}*</h3>
    <p v-if="bookData.author">von {{ bookData.author }}</p>
    <p v-if="bookData.price" class="price">{{ bookData.price }}</p>
    <a 
      :href="bookData.amazonUrl" 
      target="_blank" 
      rel="noopener noreferrer"
      class="btn">
      Jetzt ansehen
    </a>
  </div>
  
  <div class="adBox loading" v-else-if="loading">
    <div class="loading-spinner"></div>
    <p>Lade Buchinformationen...</p>
  </div>
  
  <div class="adBox error" v-else>
    <p>Keine Buchdaten verfügbar</p>
    <p>ASIN: {{ props.asin }}</p>
  </div>
</template>

<script setup lang="ts">
const affiliateTag = 'naturamentali-21'

const props = defineProps<{ 
  asin: string
}>()

const bookData = ref<any>(null)
const loading = ref(false)
const error = ref(false)

async function fetchFromAmazonAPI(asin: string) {
  if (!asin) return
  
  loading.value = true
  error.value = false

  try {
    console.log('🔄 Versuche Amazon PA-API für ASIN:', asin)

    // Debug: Prüfe ob das Modul geladen werden kann
    let AmazonPaapi
    try {
      const paapiModule = await import('amazon-paapi')
      AmazonPaapi = paapiModule
      console.log('✅ AmazonPaapi Modul geladen:', AmazonPaapi)
    } catch (importError) {
      console.error('❌ AmazonPaapi Import fehlgeschlagen:', importError)
      throw new Error('Amazon PA-API Modul konnte nicht geladen werden')
    }

    // Prüfe ob GetItems existiert
    if (!AmazonPaapi.GetItems) {
      console.error('❌ GetItems nicht verfügbar in:', AmazonPaapi)
      throw new Error('GetItems Methode nicht verfügbar')
    }
    
    const config = useRuntimeConfig()
    
    // Prüfe ob API Keys vorhanden sind
    if (!config.public.amazonAccessKey || !config.public.amazonSecretKey) {
      console.warn('⚠️ Amazon API Keys nicht konfiguriert')
      throw new Error('Amazon API Keys fehlen')
    }

    const commonParameters = {
      AccessKey: config.public.amazonAccessKey,
      SecretKey: config.public.amazonSecretKey,
      PartnerTag: affiliateTag,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.de'
    }

    console.log('🔑 Common Parameters:', { ...commonParameters, SecretKey: '***' })

    const requestParameters = {
      ItemIds: [asin],
      ItemIdType: 'ASIN',
      Resources: [
        'Images.Primary.Large',
        'ItemInfo.Title', 
        'ItemInfo.ByLineInfo',
        'Offers.Listings.Price'
      ]
    }

    console.log('📤 Request Parameters:', requestParameters)

    // Amazon API Aufruf
    const response = await AmazonPaapi.GetItems(commonParameters, requestParameters)
    
    console.log('✅ Amazon API Response:', response)

    if (response.ItemsResult && response.ItemsResult.Items.length > 0) {
      const item = response.ItemsResult.Items[0]
      
      bookData.value = {
        title: item.ItemInfo?.Title?.DisplayValue || `Buch ${asin}`,
        author: item.ItemInfo?.ByLineInfo?.Contributors?.[0]?.Name || 'Unbekannter Autor',
        imageUrl: item.Images?.Primary?.Large?.URL || '/assets/images/placeholder.jpeg',
        price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'Preis nicht verfügbar',
        amazonUrl: `https://www.amazon.de/dp/${asin}?tag=${affiliateTag}`,
        asin: asin
      }
      
      console.log('📦 Echte Amazon Daten geladen:', bookData.value)
    } else {
      throw new Error('Keine Produktdaten gefunden')
    }
    
  } catch (error) {
    console.error('❌ Amazon API Fehler:', error)
    error.value = true
    
    // Fallback mit Basis-Daten
    bookData.value = {
      title: `Buch ${asin}`,
      author: 'Autor',
      imageUrl: '/assets/images/placeholder.jpeg',
      amazonUrl: `https://www.amazon.de/dp/${asin}?tag=${affiliateTag}`,
      asin: asin
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.asin, (newAsin) => {
  if (newAsin) {
    fetchFromAmazonAPI(newAsin)
  }
})

onMounted(() => {
  if (props.asin) {
    fetchFromAmazonAPI(props.asin)
  }
})
</script>

<style lang="sass">
.adBox
  background-color: lighten($gold, 15%)
  padding: 2rem
  margin: 1rem 0
  text-align: center
  border-radius: 1rem
  width: 90%
  max-width: 320px
  
  &.loading
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    min-height: 200px
    background-color: lighten($gold, 10%)
  
  &.error
    background-color: lighten(red, 40%)
    color: darken(red, 20%)
    border: 2px solid red
  
  .loading-spinner
    width: 40px
    height: 40px
    border: 4px solid rgba(255,255,255,0.3)
    border-radius: 50%
    border-top-color: darken($gold, 20%)
    animation: spin 1s ease-in-out infinite
    margin-bottom: 1rem
  
  img
    width: 80%
    max-width: 160px
    margin-bottom: 1rem
  
  h3
    margin: 0 1rem 1rem 1rem !important
    padding: 0
  
  .price
    font-weight: bold
    color: darken($gold, 30%)
    margin-bottom: 1rem
  
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

@keyframes spin
  to
    transform: rotate(360deg)
</style>