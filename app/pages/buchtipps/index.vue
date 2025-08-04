<template>
    <div class="bookTipps container">
        <h1>Leseschätze für Herz, Geist und Alltag</h1>
        <h2>Empfohlene Bücher für Menschen, die tiefer fühlen, denken und wachsen wollen</h2>
        <BookList />
        <section class="disclaimer">
          <p><b>Hinweis</b> <span>*</span>Wir nehmen am Amazon-Partnerprogramm teil. Duch die Nutzung unserer Links kannst Du unsere Arbeit unterstützen. <br>(Es entstehen für Dich keine Mehrkosten)</p>
        </section>
    </div>
</template>

<script setup lang='ts'>
import { books } from '@/utils/books'

const advertisingId = 'naturamentali-21'

const amazonLink = (asin: string) => `https://www.amazon.de/dp/${asin}/?tag=${advertisingId}`

// SEO-Meta
useSeoMeta({
  title: 'Leseschätze – Buchtipps zu Natur, Gesundheit und innerem Wachstum',
  description: 'Entdecke handverlesene Buchtipps zu Achtsamkeit, Heilpflanzen, Naturverbindung und persönlicher Entwicklung. Für alle, die tiefer lesen wollen.',
})

// strukturierte Daten synchron erstellen
const bookSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Leseschätze – Buchtipps',
  itemListElement: books.map((book, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Book',
      name: book.title,
      author: {
        '@type': 'Person',
        name: book.author,
      },
      image: `/assets/images/bookcovers/${book.asin}.jpg`,
      url: amazonLink(book.asin),
    },
  })),
}

// structured data sauber ins Head einfügen
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(bookSchema),
    },
  ],
})
</script>

<style lang="sass">
.bookTipps
  .disclaimer
    span
      font-size: 1rem
      margin: 0 .2rem 0 .2rem
      color: darken($gold, 30%)
      
</style>