<template>
    <div>
        <header :class="{
                small: scrollY > 100
                }">
            <div class="logoBox">                
                <img 
                src="/assets/images/NAM_Logo.svg" 
                alt="naturamentalis Logo" 
                @click="goHome"
                class="headLogo" />
            </div>
            <MainNavBar />
        </header>
        <main>
            <slot />
        </main>
        <footer>
            <div class="container">
                <div>
                    <img src="/assets/images/NAM_Logo.svg" alt="naturamentalis Logo">
                    <p>Ein Projekt von <a href="https://www.digimedialoop.de">digimedialoop.de</a></p></div>
                <div>
                    <nav class="footer-links">
                        <NuxtLink to="/impressum">Impressum</NuxtLink>
                        <NuxtLink to="/datenschutz">Datenschutz</NuxtLink>
                    </nav>
                </div>
                <div class="social-links">
                    <h3>Social Media</h3>
                    <div class="icons">
                        <a href="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"/>
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/naturamentalis">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z"/>
                            </svg>
                        </a>  
                    </div>                
                </div>
            </div>
            
        </footer>
    </div>
</template>

<script setup>
const scrollY = useState('scrollY')    
const router = useRouter()
const isMobileNavOpen = ref(false)
const { public: { liveDomain } } = useRuntimeConfig()

function goHome() {
  router.push('/')
}

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

// Nur auf der Live-Domain tracken (client-seitig)
onMounted(() => {
  if (typeof window !== 'undefined' && window.location.hostname === liveDomain) {
    useHead({
      script: [
        {
          src: 'https://umami.digimedialoop.de/script.js',
          defer: true,
          'data-website-id': 'f45cae5c-9265-4386-95ea-7dc4c4cff73f'
        }
      ]
    })
  }
})
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
        
        .logoBox
            background-image: linear-gradient(to bottom right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.6))
            border-bottom-right-radius: 50%
            padding-bottom: .5rem
            cursor: pointer

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
                margin-bottom: .5rem


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
            
            font-size: 2.6rem
            line-height: 110%
        h2
            font-size: 1.4rem
            line-height: 130%
        b, strong, .bold
            font-family: 'Mainfont-Bold'
        p, ul
            font-size: 1.2rem
        li
            margin: .5rem 0
        .container
            width: 80%
            margin: 3rem 10%
        .container-5
            width: 90%
            margin: 0 5%
        .container-10
            width: 80%
            margin: 0 10%

        // Formatierung für rechtliche Seiten    
        .dsimpBox
            h2
                color: darken($gold, 10%)
            h3
                color: darken($purple, 10%)
                font-family: 'Mainfont-Bold'
            a
                color: darken($green, 10%)
                text-decoration: underline
                font-family: 'Mainfont-Bold'

    footer
        width: 100%
        min-height: 200px
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
            gap: 1rem
            background-color: rgba(white, .92)
            padding: 2rem 5%
            border-radius: 1rem

            > div
                flex: 1 1 1
                display: flex
                flex-direction: column
                justify-content: flex-end
                min-height: 100%

                &:last-child
                    margin-right: 10%
            
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

            .social-links
                display: flex
                flex-direction: column
                gap: 0.5rem

                h3
                    margin-bottom: 0.5rem
                    font-size: 1rem
                    color: #373737

                .icons
                    display: flex
                    gap: 0.5rem

                    a
                        display: flex
                        align-items: center
                        justify-content: center
                        svg
                            width: 2.5rem
                            fill: darken($gold, 10%)

        @media (max-width: $breakpointMD)
            .container
                flex-direction: column
                margin: 0 10%
                > div
                    margin-bottom: 0
                    min-height: auto

</style>