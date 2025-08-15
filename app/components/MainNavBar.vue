<template>
  <div class="mainNav">
    <nav>
      <!-- Mobile Toggle Button -->
      <button 
        class="burger" 
        :class="{ open: isOpen }" 
        @click="toggleMenu" 
        aria-label="Menü öffnen/schließen"
        aria-expanded="isOpen"
      >
        <span></span>
        <span></span>
      </button>

      <!-- Navigation Links -->
      <ul :class="{ open: isOpen }">
        <li><NuxtLink to="/lexikon">Heilpflanzenlexikon</NuxtLink></li>
        <li><NuxtLink to="/magazin">Wohlfühlmagazin</NuxtLink></li>
        <li><NuxtLink to="/buchtipps">Leseschätze</NuxtLink></li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const isOpen = ref(false)
function toggleMenu() {
  isOpen.value = !isOpen.value
}

const router = useRouter()

// Menü schließen nach Navigation
function closeMenuOnRouteChange() {
  isOpen.value = false
}

onMounted(() => {
  router.afterEach(closeMenuOnRouteChange)
})

onBeforeUnmount(() => {
  router.off?.('afterEach', closeMenuOnRouteChange) // fallback, falls Nuxt 4 das irgendwann ändert
})
</script>

<style lang="sass">

.mainNav
  nav
    background-image: url('/assets/images/MenuBackground.svg')
    background-repeat: no-repeat
    background-position: top right
    background-size: contain
    width: 100%
    height: 100%
    margin: 0
    padding: 0
    transition: 0.6s

    ul
      display: flex
      justify-content: flex-end
      align-items: center
      list-style: none
      padding: 0 
      transition: 0.6s
      width: 95%
      margin-top: 1rem
      margin-right: 5%
      li
        a
          text-decoration: none
          color: black
          font-weight: bold
          padding: 0.5rem .6rem
          margin: 0 .5rem
          font-size: 1.2rem !important
          text-transform: uppercase
          font-family: 'Laila', sans-serif
          transition: 0.6s
          border-radius: 1rem
          transform: scale(1)
          display: inline-block
          &:hover
            background-color: rgba(white, 0.8)
            transform: scale(1.1)

  // Mobile Styles
  @media (max-width: $breakpointXXL)
    nav
      position: relative
      background-image: none

      // Burger Button (Kreis mit zwei Balken)
      .burger
        width: 4.5rem
        height: 4.5rem
        background-color: darken($gold, 10%)
        border: none
        border-radius: 50%
        position: absolute
        top: 1.6rem
        right: 2rem
        cursor: pointer
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        padding: 0
        z-index: 1001
        transition: background-color 0.3s ease

        span
          display: block
          width: 2.5rem
          height: 0.3rem
          background-color: white
          border-radius: 2px
          margin: 0.3rem 0
          transition: all 0.4s ease

        &.open
          background-color: rgba(darken($gold, 5%), 0.9)

          span
            &:first-child
              transform: rotate(45deg) translate(5px, 5px)
            &:last-child
              transform: rotate(-45deg) translate(5px, -5px)

      // Navigation Blase mit Hintergrund und Inhalt
      ul
        position: fixed
        top: 0
        right: 0
        width: 90vw
        height: calc(100vh - 2rem)
        background-color: rgba(darken($gold, 10%), 0.96)
        display: flex
        flex-direction: column
        justify-content: flex-start
        align-items: center
        list-style: none
        padding: 1.5rem 2rem
        margin: 0
        opacity: 0
        pointer-events: none
        transform: translateX(100%) scale(0.95)
        transition: opacity 0.4s ease, transform 0.4s ease
        z-index: 1000

        &.open
          opacity: 1
          pointer-events: auto
          transform: translateX(0) scale(1)
          padding-top: 15vh

        li
          margin: 1rem 0
          a
            color: white
            font-size: 1.8rem
            font-weight: bold
            text-transform: uppercase
            font-family: 'Laila', sans-serif
            text-decoration: none
            transition: 0.6s

            &:hover
              color: darken($gold, 20%)

  // Desktop: Burger verstecken
  @media (min-width: $breakpointXXL + 1)
    .burger
      display: none
</style>
