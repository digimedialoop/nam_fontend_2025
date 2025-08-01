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
            <div>
                <nav >
                    <ul>
                        <li>
                            <NuxtLink to="/lexikon">Heilkräuter</NuxtLink>
                            <NuxtLink to="/buchtipps">Leseschätze</NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>
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
                    <p>powerd by <a href="https://www.digimedialoop.de">digimedialoop.de</a></p></div>
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
$breakpointSM: 576px
$breakpointMD: 768px
$breakpointLG: 992px

$red: #c09c9c
$purple: #9389a3
$gold: #eddcb3

@font-face
    font-family: "Laila"
    src: url("/assets/fonts/Laila-Light.ttf") format("truetype")
    font-weight: normal
    font-style: normal
    font-display: swap

@font-face
    font-family: "Mainfont"
    src: url("/assets/fonts/Urbanist-Light.ttf") format("truetype")
    font-weight: normal
    font-style: normal
    font-display: swap

@font-face
    font-family: "Mainfont-Bold"
    src: url("/assets/fonts/Urbanist-Medium.ttf") format("truetype")
    font-weight: normal
    font-style: normal
    font-display: swap

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

            nav
                background-image: url('/assets/images/MenuBackground.svg')
                background-repeat: no-repeat
                background-position: top right
                background-size: contain
                width: 100%
                height: 100%
                text-align: center
                margin: 0 
                padding: 0
                transition: .6s
                ul
                    display: flex
                    justify-content: space-evenly
                    align-items: center
                    list-style: none
                    padding: 0 0 0 15%
                    transition: .6s
                    max-width: 80%
                    margin-top: 1rem
                    li
                        a
                            text-decoration: none
                            color: black
                            font-weight: bold
                            padding: 0.5rem 1.5rem
                            margin: 0 1rem
                            font-size: 1.4rem
                            text-transform: uppercase
                            font-family: 'Laila', sans-serif
                            transition: .6s
                            border-radius: 1rem
                            transform: scale(1)
                            display: inline-block
                            &:hover
                                background-color: rgba(white, .6)
                                transform: scale(1.1)

                @media (max-width: $breakpointMD)
                    background-image: none
                    background: $gold
                    width: 4.5rem
                    height: 4.5rem
                    border-radius: 50%
                    position: absolute
                    top: 1.6rem
                    right: 2rem
                    ul
                        display: none
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