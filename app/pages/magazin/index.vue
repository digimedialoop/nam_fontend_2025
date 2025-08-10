<template>
    <div class="container">
        <h1>Wissensgarten</h1>
        <h2>In unserem Magazin gedeihen Gedanken und Erfahrungen, die Körper, Geist und Seele nähren.</h2>
        <div class="articleList">
            <div
                v-for="article in articles.data"
                :key="article.link"
                class="articleBox"
            >
                <NuxtLink :to="`/magazin/artikel/${article.slug}`">
                <img :src="url + article.image[0].url" :alt="article.image[0].alternativeText" />
                <h3>{{ article.title }}</h3>
                </NuxtLink>
            </div>
        </div>             
    </div>
</template>

<script setup>
//import { articles } from '~/utils/articles'  

const token = useRuntimeConfig().public.strapiToken
const url = useRuntimeConfig().public.strapiUrl

const { data: articles, error, pending } = await useFetch(`${url}/api/articles?populate=*`, {
  headers: {
    Authorization: `Bearer ${token}`
  },
  async: true // Optional: Asynchroner Abruf
})
</script>

<style lang="sass">
.articleList
    margin: 3rem 0
    display: flex
    flex-wrap: wrap
    gap: 2rem // Abstand statt margin an den Items

.articleBox
    flex: 0 0 220px // fixe Breite
    background-color: white
    border: 1px solid lighten($gold, 10%)
    border-radius: 0.8rem
    box-shadow: 0 2px 8px rgba(0,0,0,0.1)
    cursor: pointer
    text-align: center
    transition: transform 0.2s ease
    padding: 0
    display: flex
    flex-direction: column
    height: 300px // z.B. gleiche Höhe für alle
    justify-content: flex-start

    &:hover
        transform: translateY(-4px)

    img
        width: 100%
        height: 150px
        object-fit: cover
        display: block
        border-radius: 0.6rem 0.6rem 0 0
        margin: 0

    h3
        font-family: 'Laila', sans-serif
        font-size: 1rem
        margin: 1rem
        padding-bottom: 1rem
        color: darken($gold, 40%)
        flex-grow: 1 // lässt den Titel Raum, sich gleichmäßig zu verteilen

</style>