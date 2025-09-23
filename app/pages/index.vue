<template>
    <div class="home">
        <div class="container-5">
          <h1>Dein Magazin für Inspiration und Lebenskraft im Einklang der Natur</h1>
          
        </div>
        <div class="magazinTeaserBox">
          <h2>Wo uraltes Wissen wurzelt und neue Einsichten sprießen</h2>
            <h3>Wohlfühlmagazin</h3>
            <p>Im Magazin erwarten dich Impulse für Körper, Geist und Seele. Von achtsamen Alltagstipps über kreative Inspiration bis zu tiefgründigen Gedanken, die dir helfen dich zu reflektieren und dich bewegen werden. Tauche ein in einen der neuesten Artikel...</p> 
            <!-- <button @click="goToMagazin">Tauche ein ins Magazin</button> -->
            <ArticleCarousel 
              mode="latest"
              :count="10"
              size="S"
              title=""
            />
        </div>
        
        <!-- <ImageTextSection
            imageSrc="/assets/images/MagazinImage.png"
            imageAlt="Lesen gemütlich auf dem Sofa"
            imagePosition="left"
            imagePositionMobile="bottom"
            color="red"
            >
            <h2>Wo uraltes Wissen wurzelt und neue Einsichten sprießen</h2>
            <h3>Wohlfühlmagazin</h3>
            <p>Im Magazin erwarten dich Impulse für Körper, Geist und Seele. Von achtsamen Alltagstipps über kreative Inspiration bis zu tiefgründigen Gedanken, die dich reflektieren und bewegen.</p> 

            <ArticleCarousel 
              mode="latest"
              :count="6"
              size="S"
              title=""
            />

        </ImageTextSection> -->

        

        <ImageTextSection
            imageSrc="/assets/images/BuchImage.png"
            imageAlt="Kräuter Tinktur"
            imagePosition="left"
            imagePositionMobile="bottom"
            color="purple"
            >
            <h2>Inspiration für Herz, Kopf und Alltag</h2>
            <h3>Leseschätze</h3>
            <p>Empfohlene Werke rund um Natur, Geist und Selbstfürsorge, sorgfältig ausgewählt für Menschen, die tiefer verstehen, fühlen und wachsen wollen. 
                </p><p>Unsere Leseschätze eröffnen dir neue Perspektiven auf das Zusammenspiel von Körper, Seele und Umwelt. Ob spirituelle Impulse, wissenschaftliche Erkenntnisse oder praktische Anleitungen. Hier findest du Bücher, die dich inspirieren und begleiten.</p>
            <button class="btn" @click="goToBuchtipps">Finde Dein Herzensbuch</button>
        </ImageTextSection>

        <ImageTextSection
            imageSrc="/assets/images/TinkturImage.png"
            imageAlt="Kräuter Tinktur"
            imagePosition="right"
            imagePositionMobile="bottom"
            color="green"
            >
            <h2>Entdecke die Kraft der Natur</h2>
            <h3>Heilpflanzenlexikon</h3>
            <p>Überliefertes Wissen für mehr Gesundheit, Selbstfürsorge und ein tieferes Verständnis natürlicher Heilweisen. 
                </p><p>Unser Heilpflanzenlexikon bietet dir wertvolle Informationen zu zahlreichen Kräutern und deren Anwendung. Von bewährten Hausmitteln bis zu wissenschaftlich fundierten Wirkstoffen.</p> 
            <button class="btn" @click="goToLexikon">Zur Hausapotheke</button>
        </ImageTextSection>

        
    </div>
</template>

<script setup>
const router = useRouter()

function goToLexikon() {
  router.push('/lexikon')
}
function goToMagazin() {
  router.push('/magazin')
}
function goToBuchtipps() {
  router.push('/buchtipps')
}

useSeoMeta({
  title: 'naturamentalis – Ganzheitliches Wissen für Körper und Geist',
  description: 'Entdecke bei naturamentalis ein umfassendes Heilpflanzenlexikon, inspirierende Leseschätze und praktische Anleitungen für ein gesundes und bewusstes Leben im Einklang mit der Natur.',
  ogTitle: 'naturamentalis – Ganzheitliches Wissen für Körper und Geist',
  ogDescription: 'Heilpflanzen, Leseschätze und natürliche Lebensweise für mehr Gesundheit und Wohlbefinden.',
  ogImage: 'https://www.naturamentalis.de/assets/images/NAM_Logo.svg',
  twitterTitle: 'naturamentalis – Ganzheitliches Wissen für Körper und Geist',
  twitterDescription: 'Heilpflanzen, Leseschätze und natürliche Lebensweise für mehr Gesundheit und Wohlbefinden.',
  twitterImage: 'https://www.naturamentalis.de/assets/images/NAM_Logo.svg',
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://www.naturamentalis.de',
        name: 'naturamentalis',
        description: 'Ganzheitliches Wissen für Körper, Geist und Seele. Heilpflanzenlexikon und inspirierende Leseschätze für ein bewusstes Leben.',
        publisher: {
          '@type': 'Organization',
          name: 'naturamentalis',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.naturamentalis.de/assets/images/NAM_Logo.svg'
          }
        }
      }),
    }
  ],
  __dangerouslyDisableSanitizers: ['script'],
})

</script>

<style lang="sass">
.home
  h1
    font-size: 2.4rem
    margin-top: -2rem
    margin-bottom: 10vh
    font-family: 'Laila'
    color: darken($gold, 30%)
    @media (max-width: $breakpointMD)
      margin-top: 0

  .magazinTeaserBox
    padding: 0 10vw
    
    h2    
      font-size: 1.2rem
      font-style: italic
      margin: 0
      color: darken($red, 20%)
    h3      
      font-size: 2.4rem 
      margin: 1rem 0 1.6rem 0
      line-height: 120%
</style>