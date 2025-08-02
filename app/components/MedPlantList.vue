<template>
  <ul class="med-plant-list">
    <li v-for="plant in plants" :key="plant.botanicalTitle">
        <NuxtLink
            :to="`/heilpflanze/${plant.slug}`"
            class="plant-link"
        >
            <div class="image-wrapper">
                <img
                :src="`/assets/images/medplants/${plant.image}`"
                :alt="plant.title"
                >
            </div>
            <div>
                <h2>{{ plant.title }}</h2>
                <h3>{{ plant.botanicalTitle }}</h3>
                <p><span v-for="(t, i) in plant.type" :key="i" class="tag">{{ t }}</span></p>
            </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
import { plants } from '@/utils/medPlants'

// Meta-Daten für SEO
useSeoMeta({
  title: 'Heilpflanzen entdecken – Naturamentis Kräuterschätze',
  description: 'Umfassende Übersicht ausgewählter Heilpflanzen mit Informationen zu Wirkung, Geschichte und Anwendung. Entdecke die Kraft der Natur für Körper und Geist.',
})

// Schema.org JSON-LD für die Liste der Heilpflanzen
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Heilpflanzen Übersicht',
        'itemListElement': plants.map((plant, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article', 
            name: plant.title,
            alternateName: plant.botanicalTitle,
            image: `https://www.naturamentis.de/assets/images/medplants/${plant.image}`,
            url: `https://www.naturamentis.de/heilpflanze/${plant.slug}`,
            description: plant.teaser || plant.medApplication || '',
          },
        })),
      }),
    },
  ],
})
</script>

<style lang="sass">
.med-plant-list
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
    column-gap: 1.5rem
    row-gap: 3rem
    justify-content: center
    padding: 1rem
    list-style: none

    li
        display: contents  // kein eigenes Layout mehr – alles übernimmt .plant-link

    .plant-link
        display: flex
        flex-direction: column
        align-items: center
        text-align: center
        background-image: linear-gradient(to bottom right, lighten($gold, 10%), darken($gold, 5%))
        border-radius: 1rem
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1)
        transition: transform 0.2s ease
        cursor: pointer
        overflow: hidden
        padding-bottom: .4rem
        
        text-decoration: none
        color: inherit
        width: 100%
        height: 100%

        &:hover
            transform: translateY(-4px)

        .image-wrapper
            width: 100%

        img
            display: block
            width: 100%
            height: auto
            aspect-ratio: 1 / 1
            object-fit: cover
            border-radius: 1rem 1rem 0 0
            margin: 0
            padding: 0

        div
            padding: 0 1rem
            width: 100%
            color: #333

        h2
            font-size: 1.6rem
            margin: 1.2rem 0 .5rem 0
            font-family: 'Laila'

        h3
            font-size: 1rem
            margin: 0.25rem 0

        p
            font-size: 0.875rem
            color: #666
            margin: 0.25rem 0 0
            text-transform: uppercase

        .tag
            background-color: rgba(white, .2)
            padding: .25rem .6rem
            border-radius: 1rem
            margin: .4rem .25rem 
            display: inline-block
            font-size: .9rem
</style>

