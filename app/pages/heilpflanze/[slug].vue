<template>
  <div v-if="plant" class="plantDetails">
    <section class="plantHeader">
        <div class="image">
            <img :src="`/assets/images/medplants/${plant.image}`" :alt="plant.title" />
        </div>
        <div class="info">
            <h1>{{ plant.title }}</h1> 
            <p class="subtitle">{{ plant.botanicalTitle }}</p>
            <p class="teaser">{{ plant.teaser }}</p>
            <h2>Typ</h2> 
            
            <p>
              <span v-for="(t, i) in plant.type" :key="i" class="tag">{{ t }}</span>
            </p>
            <h2>Wirkbereiche</h2> 
            <p>
              <span v-for="(ea, i) in plant.effectArea" :key="i" class="tag">{{ ea }}</span>
            </p>
        </div>
    </section>
    <section class="container history">
        <h2>Geschichte / Herkunft</h2>
        <p v-if="plant.history">{{ plant.history }}</p>
    </section>
    <section class="container medapp">
        <h2>Anwendungsbereiche</h2>
        <p v-if="plant.medApplication">{{ plant.medApplication }}</p>
    </section>
    <section class="container similarPlants">
      <h2>Heilpflanzen mit ähnlicher Wirkung</h2>
      <ul v-if="similarPlants.length">
        
        <li v-for="sp in similarPlants" :key="sp.slug">
          <NuxtLink :to="`/heilpflanze/${sp.slug}`">
          <img
            :src="`/assets/images/medplants/${sp.image}`"
            :alt="sp.title"
          />
          <p>{{ sp.title }}</p>
          </NuxtLink>
        </li>
      </ul>
      <p v-else>Keine ähnlichen Pflanzen gefunden.</p>
    </section>
    <section class="container">
      <Disclaimer />
    </section>
    
  </div>
  <div v-else>
    <p>Pflanze nicht gefunden.</p>
  </div>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSeoMeta, useHead } from '#imports'
import { plants } from '@/utils/medPlants'

const route = useRoute()
const slug = route.params.slug as string

const plant = computed(() =>
  plants.find((p) => p.slug === slug)
)

const imageUrl = computed(() => `/images/plants/${slug}.jpg`)
const pageUrl = computed(() => `https://www.naturamentalis.de/heilpflanzen/${slug}`)

// Liste der ähnlichen Pflanzen nach Wirkung
const similarPlants = computed(() => {
  if (!plant.value) return []

  return plants.filter(p => {
    if (p.slug === plant.value.slug) return false // gleiche Pflanze ausschließen

    // mindestens eine gemeinsame Wirkung?
    return p.effectArea.some(area => plant.value.effectArea.includes(area))
  })
})

useSeoMeta(() => {
  if (!plant.value) return {}
  return {
    title: `${plant.value.title} (${plant.value.botanicalTitle})`,
    description: plant.value.teaser,
    ogTitle: `${plant.value.title} (${plant.value.botanicalTitle})`,
    ogDescription: plant.value.teaser,
    ogImage: imageUrl.value,
    twitterTitle: `${plant.value.title} (${plant.value.botanicalTitle})`,
    twitterDescription: plant.value.teaser,
    twitterImage: imageUrl.value,
  }
})

useHead(() => {
  if (!plant.value) return {}
  return {
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${plant.value.title} (${plant.value.botanicalTitle})`,
          description: plant.value.teaser,
          image: imageUrl.value,
          url: pageUrl.value,
          author: {
            '@type': 'Organization',
            name: 'naturamentalis',
          },
          mainEntityOfPage: pageUrl.value,
          about: {
            '@type': 'Thing',
            name: plant.value.title,
            alternateName: plant.value.botanicalTitle,
            description: plant.value.teaser,
          },
        }),
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      // optional, wenn du mehrere Tags erzeugst
    },
    __dangerouslyDisableSanitizers: ['script'],
  }
})
</script>


<style lang="sass">
.plantDetails
    .plantHeader
        display: grid
        grid-template-columns: 2fr 3fr
        gap: 2rem
        margin-bottom: 5rem
        padding-top: 2rem
        align-items: start
        

        .image, .info
            flex: 1 1 50%

        .image
            position: relative
            &::before
                content: ''
                width: 100%
                height: 100%
                background-image: url('/assets/images/ImageBGshape.svg')
                background-repeat: no-repeat
                background-size: contain
                position: absolute
                top: 0
                left: -5%
                z-index: 1
            img
                position: relative
                width: 80%
                max-width: 450px
                margin: 5rem 0 0 10%
                border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%
                z-index: 2
                border: 10px solid $gold
        
        .info
            margin: 0 10% 0 10%
            h1
                margin: .5rem 0
            h2
                font-size: 1rem
                margin: 1.4rem 0 .2rem 0
                font-family: 'Mainfont-Bold', sans-serif
                text-transform: uppercase
                letter-spacing: .08rem
            p
                margin: .2rem 0
            .subtitle
                font-style: italic
                margin: .5rem 0 2rem 0

            .tag
                background-color: $lightgrey
                padding: .25rem .6rem
                border-radius: .6rem
                margin: .4rem .25rem 
                display: inline-block
                font-size: .9rem

            .teaser
                background-color: lighten($green, 20%)
                padding: 1rem 1.5rem
                border-radius: 1rem
            
        @media (max-width: $breakpointMD)
            grid-template-columns: 1fr
            grid-template-rows: auto auto
    h2
        font-family: 'Laila', sans-serif
        font-size: 1.6rem

    .similarPlants
      ul
        list-style: none
        padding: 0
        margin: 1rem 0
        display: flex
        flex-wrap: wrap
        gap: 1rem
        justify-content: flex-start

        li
          background-color: white
          border-radius: 0.8rem
          box-shadow: 0 2px 8px rgba(0,0,0,0.1)
          width: 120px
          padding: 0
          cursor: pointer
          text-align: center
          transition: transform 0.2s ease

          &:hover
            transform: translateY(-4px)

          img
            width: 100%           
            height: 100px         
            object-fit: cover     
            display: block
            border-radius: 0.6rem 0.6rem 0 0
            margin: 0

          p
            display: block
            font-family: 'Laila', sans-serif
            font-size: .9rem
            margin: .5rem auto
            color: darken($gold, 40%)


</style>
