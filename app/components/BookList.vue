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
        <strong>{{ book.title }}</strong><br>
        <span>{{ book.author }}</span>
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
  gap: 1.5rem
  justify-content: center
  padding: 2rem
  list-style: none

  li
    display: flex
    flex-direction: column
    align-items: center
    text-align: center
    background: #f9f9f9
    padding: 1rem
    border-radius: 1rem
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1)
    transition: transform 0.2s ease
    cursor: pointer

    &:hover
      transform: translateY(-4px)

    img
      max-width: 100%
      height: auto
      margin-bottom: 0.75rem
      border-radius: 0.5rem

    a
      color: #333
      text-decoration: none

      strong
        display: block
        font-size: 1rem
        margin-bottom: 0.25rem

      span
        font-size: 0.875rem
        color: #666

</style>
