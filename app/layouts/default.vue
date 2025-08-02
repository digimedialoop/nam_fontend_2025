<template>
    <div>
        <header :class="{
                small: scrollY > 100
                }">
            <div>                
                <img 
                src="/assets/images/NAM_Logo.svg" 
                alt="naturamentis Logo" 
                @click="goHome"
                class="headLogo" />
            </div>
            <MainNavBar />
        </header>
        <main>
            <Transition name="slide-fade" mode="out-in">
                <NuxtPage />
            </Transition>
        </main>
        <footer>
            <div class="container">
                <div>
                    <img src="/assets/images/NAM_Logo.svg" alt="naturamentis Logo">
                    <p>Ein Projekt von <a href="https://www.digimedialoop.de">digimedialoop.de</a></p></div>
                <div>
                    <nav class="footer-links">
                        <NuxtLink to="/impressum">Impressum</NuxtLink>
                        <NuxtLink to="/datenschutz">Datenschutz</NuxtLink>
                    </nav>
                </div>
                <div></div>
            </div>
            
        </footer>
    </div>
</template>

<script setup>
import MainNavBar from '~/components/MainNavBar.vue'

const scrollY = useState('scrollY')    
const router = useRouter()
const isMobileNavOpen = ref(false)

function goHome() {
  router.push('/')
}

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value
}
</script>


<style lang="sass">




.slide-fade-enter-active,
.slide-fade-leave-active
  transition: opacity 0.4s ease, transform 0.4s ease

.slide-fade-enter-from
  opacity: 0
  transform: translateX(-40px) translateY(-20px)

.slide-fade-enter-to
  opacity: 1
  transform: translateX(0)

.slide-fade-leave-from
  opacity: 1
  transform: translateX(0)

.slide-fade-leave-to
  opacity: 0
  transform: translateX(40px) translateY(20px)

body 
    margin: 0
    padding: 0
    font-size: 16px
    font-family: 'Mainfont', sans-serif
    hyphens: auto

    a
        text-decoration: none
        color: black
        cursor: pointer

    header
        display: flex
        justify-content: space-between
        align-items: flex-start
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 140px
        z-index: 100
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))
        
        @media (max-width: $breakpointMD)
            height: 80px
        &.small
            @media (min-width: $breakpointMD)
                nav
                    width: 80%
                    ul
                        margin-top: 1rem
                        li
                            a
                                font-size: 1.2rem
            .headLogo
                height: 80%
                margin-top: .5rem


        > div
            width: 50%
            height: 100%
            display: flex
            flex-direction: column

            &:first-child
                align-items: flex-start

            &:last-child
                align-items: flex-end

            
        .headLogo
            height: 100%
            margin: 1rem 3rem
            transition: .6s
            @media (max-width: $breakpointMD)
                margin: 1rem 1rem
            

    main
        margin-top: 28vh
        min-height: 55vh
        z-index: 0
        line-height: 150%
        @media (max-width: $breakpointMD)
            margin-top: calc(80px + 3rem)
        h1
            font-family: 'Laila'
            font-size: 2.6rem
            line-height: 110%
        h2
            font-size: 1.8rem
            line-height: 110%
        p, ul
            font-size: 1.2rem
        li
            margin: .5rem 0
        .container
            width: 80%
            margin: 3rem 10%
    footer
        width: 100%
        min-height: 400px
        height: auto
        background-image: url(/assets/images/lavendel.png)
        background-repeat: no-repeat
        background-size: cover
        background-position: center top
        padding: 2rem 0
        display: flex
        flex-direction: column
        justify-content: flex-end  // <—

        .container
            display: flex
            justify-content: space-between
            margin: 0 5%
            gap: 1.5rem
            background-color: rgba(white, .92)
            padding: 2rem 5%
            border-radius: 1rem

            > div
                flex: 1 1 1
                display: flex
                flex-direction: column
                justify-content: flex-end
                min-height: 100%
            
            .footer-links
                display: flex
                flex-wrap: wrap
                gap: 0.5rem
                margin-bottom: 1rem

                a
                    position: relative
                    text-decoration: none
                    color: black

                    &::after
                        content: '|'
                        margin-left: 0.5rem

                    &:last-child::after
                        content: '' 
            img
                max-width: 120px

        @media (max-width: $breakpointMD)
            .container
                flex-direction: column
                margin: 0 10%
                > div
                    margin-bottom: 1.5rem
                    min-height: auto

</style>