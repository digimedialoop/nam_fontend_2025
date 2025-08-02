<template>
  <ul class="med-plant-list">
    <li v-for="plant in plants" :key="plant.botanicalTitle">
      <div class="image-wrapper">
        <img
          :src="`/assets/images/medplants/${plant.image}`"
          :alt="plant.title"
        >
      </div>
      <div>
        <h2>{{ plant.title }}</h2>
        <h3>{{ plant.botanicalTitle }}</h3>
        <p>{{ plant.type }}</p>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { plants } from '@/utils/medPlants'
</script>

<style lang="sass">
.med-plant-list
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  gap: 1.5rem
  justify-content: center
  padding: 2rem
  list-style: none

  li
    display: flex
    flex-direction: column
    align-items: center
    text-align: center
    border: 2px solid $gold
    border-radius: 1rem
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1)
    transition: transform 0.2s ease
    cursor: pointer
    overflow: hidden
    padding-bottom: 1rem  // nur unten Abstand

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
      width: 100%  // wichtig, damit Textbereich nicht schmaler ist
      color: #333

      h2
        font-size: 1.2rem
        margin: 0.5rem 0 0

      h3
        font-size: 0.875rem
        margin: 0.25rem 0

      p
        font-size: 0.875rem
        color: #666
        margin: 0.25rem 0 0
</style>

