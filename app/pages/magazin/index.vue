<template>
    <div class="container">
        <h1>Wissensgarten</h1>
        <h2>In unserem Magazin geeihen Gedanken und Erfahrungen, die Körper, Geilst und Seele nähren.</h2>
        <div class="articleList">
            <div class="articleBox">
                <NuxtLink to="magazin/artikel/fermentieren-mit-der-kraft-der-natur">
                    <img src="/assets/images/magazin/fermentieren.jpg" alt="fermentiertes Gemüse im Glas">
                    <h3>Fermentieren – Wie du mit der Kraft der Natur deine Gesundheit und Seele stärkst</h3>
                </NuxtLink>
            </div>   
            <div class="articleBox">
                <NuxtLink to="magazin/artikel/der-vagusnerv-fuer-entspannung-und-regeneration">
                    <img src="/assets/images/magazin/vagusnerventspannung.jpg" alt="Frau liegt entspannt in der Natur">
                    <h3>Der Vagusnerv – Der wichtigste Nerv für Entspannung und Regeneration</h3>
                </NuxtLink>
            </div>   
        </div>
             
    </div>
</template>

<script setup>
    
</script>

<style lang="sass">
.articleList
    margin: 3rem 0
    .articleBox
        width: 200px
        background-color: white
        border: 1px solid lighten($gold, 10%)
        border-radius: 0.8rem
        box-shadow: 0 2px 8px rgba(0,0,0,0.1)
        width: 220px
        padding: 0
        cursor: pointer
        text-align: center
        transition: transform 0.2s ease
        display: inline-block
        margin: 0 1rem 2rem 1rem

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
            display: block
            font-family: 'Laila', sans-serif
            font-size: 1rem
            margin: 1rem 1rem
            padding: 0 0 1rem 0
            color: darken($gold, 40%)
</style>