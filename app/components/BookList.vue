<!-- app/components/BookList.vue -->
<template>
  <ul class="book-list">
    <li v-for="book in books" :key="book.asin">
      <img
        :src="`/assets/images/bookcovers/${book.asin}.jpg`"
        :alt="book.title"
      >
      <a
        :href="amazonLink(book.asin)"
        target="_blank"
        rel="noopener sponsored"
      >
        <h2>{{ book.title }}<span>*</span></h2>
        <h3>{{ book.author }}</h3>
      </a>
    </li>
  </ul>
</template>

<script setup>
import { books } from '@/utils/books'

const advertisingId = 'naturamentali-21'

const amazonLink = (asin) => {
  return `https://www.amazon.de/dp/${asin}/?tag=${advertisingId}`
}


</script>

<style lang="sass">
.book-list
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  gap: 2rem
  justify-content: center
  padding: 2rem
  list-style: none

  li
    display: flex
    flex-direction: column
    align-items: center
    text-align: center
    border: 2px solid lighten($gold, 10%)
    padding: 1rem
    border-radius: 1rem
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1)
    transition: transform 0.2s ease
    cursor: pointer

    &:hover
      transform: translateY(-4px)

    img
      max-width: 100%
      height: 250px
      margin: 0
      border-radius: 0.5rem

    a
      color: #333
      text-decoration: none

    h2
      font-family: 'Laila' 
      font-size: 1.4rem
      margin: 2rem 0 1rem 0
      span
        font-size: 1rem
        margin: 0 0 0 .2rem
        color: darken($gold, 30%)
    
    h3
      font-size: 1.1rem

</style>
