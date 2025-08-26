<template>
    <div class="home">
        <div class="container-5">
          <h1>Dein Magazin für Inspiration und Lebenskraft im Einklang der Natur</h1>
        </div>
        
        <ImageTextSection
            imageSrc="/assets/images/MagazinImage.png"
            imageAlt="Lesen gemütlich auf dem Sofa"
            imagePosition="left"
            imagePositionMobile="bottom"
            color="red"
            >
            <h2>Wo uraltes Wissen wurzelt und neue Einsichten sprießen</h2>
            <h3>Wohlfühlmagazin</h3>
            <p>Tauche ein in fundierte Beiträge über Heilpflanzen, fermentierte Lebensmittel und die Weisheit des Körpers – vom Nervensystem bis zur Darmgesundheit. 
                </p><p>Lerne, wie du mit einfachen Mitteln dein Wohlbefinden stärkst, sei es durch selbstgemachte Tinkturen, entspannende Atemübungen oder die Kraft fermentierter Lebensmittel.</p> 
            <button @click="goToMagazin">Tauche ein ins Magazin</button>
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
            <button @click="goToLexikon">Zur Hausapotheke</button>
        </ImageTextSection>

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
            <button @click="goToBuchtipps">Finde Dein Herzensbuch</button>
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
    font-family: 'Mainfont'
    @media (max-width: $breakpointMD)
      margin-top: 0
</style>