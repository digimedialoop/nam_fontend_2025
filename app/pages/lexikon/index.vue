<template>
    <div class="medPlants container">
        <h1>Heilpflanzenlexikon</h1>
        <h2>Informationen zu Wirkung, Geschichte und Anwendung. Entdecke die Kraft der Natur für Körper und Geist.</h2>
        <MedPlantList />
    </div>
</template>

<script setup lang="ts">
import { plants } from '@/utils/medPlants'

// SEO-Metadaten
useSeoMeta({
  title: 'Heilpflanzen entdecken – Naturamentis Kräuterschätze',
  description:
    'Umfassende Übersicht ausgewählter Heilpflanzen mit Informationen zu Wirkung, Geschichte und Anwendung. Entdecke die Kraft der Natur für Körper und Geist.',
})

// JSON-LD Schema-Markup
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Heilpflanzen Übersicht',
        itemListElement: plants.map((plant, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            name: plant.title,
            alternateName: plant.botanicalTitle,
            image: `/assets/images/medplants/${plant.image}`,
            url: `/heilpflanze/${plant.slug}`,
            description: plant.teaser || plant.medApplication || '',
          },
        })),
      }),
    },
  ],
  __dangerouslyDisableSanitizers: ['script'],
})
</script>





<style lang="sass">
.medPlants
    h2
        font-size: 1.4rem
        line-height: 130%
</style>