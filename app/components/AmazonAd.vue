<template>
  <div class="adBox" v-if="product">
    <img :src="`/assets/images/bookcovers/${product.productkey}.jpg`" :alt="product.name">
    <h3>{{ product.name }}*</h3>
    <a 
      :href="`https://www.amazon.de/dp/${product.productkey}?tag=${affiliateTag}`" 
      target="_blank" 
      rel="noopener noreferrer"
      class="btn">
      Jetzt ansehen
    </a>
  </div>
</template>

<script setup lang="ts">
const affiliateTag = 'naturamentali-21'

defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<style lang="sass">
.adBox
  background-color: lighten($gold, 15%)
  padding: 2rem
  margin: 1rem 5vw 2rem 0
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
