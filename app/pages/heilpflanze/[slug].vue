<template>
  <div v-if="plant" class="plantDetails">
    <section class="plantHeader">
        <div class="image">
            <img :src="`/assets/images/medplants/${plant.image}`" :alt="plant.title" />
        </div>
        <div class="info">
            <h1>{{ plant.title }}</h1> 
            <p class="subtitle">{{ plant.botanicalTitle }}</p>
            <p>{{ plant.teaser }}</p>
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
    
  </div>
  <div v-else>
    <p>Pflanze nicht gefunden.</p>
  </div>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'
import { plants } from '@/utils/medPlants'

const route = useRoute()
const slug = route.params.slug as string

const plant = plants.find((p) => p.slug === slug)
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

        @media (max-width: $breakpointMD)
            grid-template-columns: 1fr
            grid-template-rows: auto auto
    h2
        font-family: 'Laila', sans-serif
        font-size: 1.6rem
</style>
