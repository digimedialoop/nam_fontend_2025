<template>
  <div class="medPlants container">
    <h1>Heilpflanzenlexikon</h1>
    <h2>Informationen zu Wirkung, Geschichte und Anwendung. Entdecke die Kraft der Natur für Körper und Geist.</h2>

    <button class="toggle-filters" @click="filtersOpen = !filtersOpen" type="button">
      {{ filtersOpen ? 'X' : 'Filtern' }}
    </button>

    <transition name="slide-down">
      <section v-if="filtersOpen" class="filters">
        <div class="filter-group">
          <h3>Typ</h3>
          <div class="buttons-wrapper">
            <button
              type="button"
              :class="{ active: selectedType === null }"
              @click="selectedType = null"
            >
              Alle
            </button>
            <button
              v-for="type in allTypes"
              :key="type"
              type="button"
              :class="{ active: selectedType === type }"
              @click="selectType(type)"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <h3>Wirkungsbereich</h3>
          <div class="buttons-wrapper">
            <button
              type="button"
              :class="{ active: selectedEffectArea === null }"
              @click="selectedEffectArea = null"
            >
              Alle
            </button>
            <button
              v-for="area in allEffectAreas"
              :key="area"
              type="button"
              :class="{ active: selectedEffectArea === area }"
              @click="selectEffectArea(area)"
            >
              {{ area }}
            </button>
          </div>
        </div>
      </section>
    </transition>

    <MedPlantList :plants="filteredPlants" />
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { plants } from '@/utils/medPlants'
import MedPlantList from '@/components/MedPlantList.vue'

const allTypes = Array.from(new Set(plants.flatMap(p => p.type))).sort()
const allEffectAreas = Array.from(new Set(plants.flatMap(p => p.effectArea))).sort()

const selectedType = ref<string | null>(null)
const selectedEffectArea = ref<string | null>(null)

const filtersOpen = ref(false)

function selectType(type: string) {
  if (selectedType.value === type) {
    selectedType.value = null
  } else {
    selectedType.value = type
  }
}

function selectEffectArea(area: string) {
  if (selectedEffectArea.value === area) {
    selectedEffectArea.value = null
  } else {
    selectedEffectArea.value = area
  }
}

const filteredPlants = computed(() => {
  return plants.filter(plant => {
    const typeMatch = !selectedType.value || plant.type.includes(selectedType.value)
    const effectAreaMatch = !selectedEffectArea.value || plant.effectArea.includes(selectedEffectArea.value)
    return typeMatch && effectAreaMatch
  })
})
</script>


<style lang="sass">
.toggle-filters
  margin: 1rem 0
  padding: 0.5rem 1rem
  background-color: darken($gold, 0%)
  border: none
  border-radius: 0.5rem
  color: darken($gold, 45%)
  text-transform: uppercase
  font-weight: bold
  cursor: pointer
  font-size: 1.2rem
  transition: background-color 0.3s ease
  &:hover
    background-color: darken($gold, 10%)

.slide-down-enter-active,
.slide-down-leave-active
  transition: max-height 0.6s ease, opacity 0.5s ease, padding 0.6s ease
.slide-down-enter-from,
.slide-down-leave-to
  max-height: 0
  opacity: 0
  padding-top: 0
  padding-bottom: 0
.slide-down-enter-to,
.slide-down-leave-from
  max-height: 1000px /* groß genug, damit Inhalt reinpasst */
  opacity: 1
  padding-top: 2rem
  padding-bottom: 2rem

.filters
  display: flex
  flex-direction: column
  gap: 2rem
  background-color: lighten($green, 15%)
  padding: 1rem 5vw
  border-radius: 1rem
  margin-bottom: 2rem

.filter-group
  display: flex
  flex-direction: column
  gap: .5rem

  h3
    margin: 0

  .buttons-wrapper
    display: flex
    flex-wrap: wrap
    gap: 0.5rem

    button
      margin: 0
      padding: 0.2rem 0.7rem
      border: 1px solid #ccc
      background-color: white
      cursor: pointer
      border-radius: 0.3rem
      transition: background-color 0.3s ease
      font-family: 'Laila', sans-serif
      display: inline-block

      &.active
        background-color: $gold
        border-color: darken($gold, 5%)
        color: black

</style>
