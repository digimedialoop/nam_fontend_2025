// compontents/MedPlantList.vue
<template>
  <ul class="med-plant-list">
    <li v-for="plant in sortedPlants" :key="plant.botanicalTitle">
      <NuxtLink
        :to="`/heilpflanze/${plant.slug}`"
        class="plant-link"
      >
        <div class="image-wrapper">
          <img
            :src="`/assets/images/medplants/${plant.image}`"
            :alt="plant.title"
          />
        </div>
        <div>
          <h2>{{ plant.title }}</h2>
          
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  plants: {
    type: Array,
    required: true,
  },
})

// Alphabetisch sortieren
const sortedPlants = computed(() =>
  [...props.plants].sort((a, b) => a.title.localeCompare(b.title))
)
</script>

<style lang="sass">
.med-plant-list
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))
    column-gap: 1rem
    row-gap: 3rem
    justify-content: center
    padding: 1rem
    list-style: none    
    margin: 0 auto  

    li
        display: contents  // kein eigenes Layout mehr – alles übernimmt .plant-link

    .plant-link
        display: flex
        flex-direction: column
        align-items: center
        text-align: center
        background-image: linear-gradient(to bottom right, lighten($gold, 40%), lighten($gold, 10%))
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
            font-size: 1.2rem
            margin: 1.2rem 0.1rem .5rem 0.1rem
            font-family: 'Laila'
            hyphens: auto

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

