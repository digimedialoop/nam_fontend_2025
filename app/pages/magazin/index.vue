<template>
  <div class="container">
    <h1>Wohlfühlmagazin</h1>
    <h2>
      In unserem Garten des Wissens gedeihen Gedanken und Erfahrungen,
      die Körper, Geist und Seele nähren.
    </h2>

    <div class="articleList">
  <div
    v-for="article in articles?.data || []"
    :key="article.link || article.id"
    class="articleBox"
  >
    <NuxtLink :to="`/magazin/artikel/${article.slug || ''}`">
      <img
        :src="getImage(article)"
        :alt="getAlt(article)"
      />
      <p class="subtitle">
        {{ getRandomCategory(article.articlecategories) }}
      </p>
      <h3>{{ article.title }}</h3>
    </NuxtLink>
  </div>

  <div v-if="!articles?.data?.length">
    <p>Hopala - wir mussten leider unser System kurz runterfahren.</p>
    <p>Wenn du magst, kannst du aber gerne später wieder vorbei schauen.</p>
  </div>
</div>


  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Wohlfühlmagazin für Körper und Seele - naturamentalis Magazin',
  description:
    'Artikel rund um die Themen: Körper, Gesundheit, Vitalität, Achtsamkeit, Innere Balance, Kreativität, Inspiration, Kulinarik und Natur. ',
})

const token = useRuntimeConfig().public.strapiToken
const url = useRuntimeConfig().public.strapiUrl

const { data: articles, error, pending } = await useFetch(
  `${url}/api/articles?populate=*&sort[0]=publishdate:desc`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    async: true,
  }
)

const getRandomCategory = (categories) => {
  if (!categories || categories.length === 0) return ''
  const randomIndex = Math.floor(Math.random() * categories.length)
  return categories[randomIndex].category
}

const getImage = (article) => {
  if (article?.image?.[0]?.url) {
    return url + article.image[0].url
  }
  return '/images/fallback.jpg' // Fallback-Bild aus /public/images/
}

const getAlt = (article) => {
  if (article?.image?.[0]?.alternativeText) {
    return article.image[0].alternativeText
  }
  return article?.title || 'Artikelbild'
}
</script>


<style lang="sass">
.articleList
    margin: 3rem 0
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
    gap: 2rem

.articleBox
    background-color: white
    border: 1px solid lighten($gold, 10%)
    border-radius: 0.8rem
    box-shadow: 0 2px 8px rgba(0,0,0,0.1)
    cursor: pointer
    text-align: center
    transition: transform 0.2s ease
    display: flex
    flex-direction: column

    &:hover
        transform: translateY(-4px)

    img
        width: 100%
        height: 180px
        object-fit: cover
        border-radius: 0.6rem 0.6rem 0 0
        display: block

    .subtitle
        font-size: .9rem
        color: darken($gold, 30%)
        margin: 0.5rem 0

    h3
        font-family: 'Laila', sans-serif
        font-size: 1.1rem
        margin: 0 1rem 1rem
        padding-bottom: 1rem
        color: black
        flex-grow: 1

</style>