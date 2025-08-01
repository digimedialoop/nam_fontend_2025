<template>
    <div>
        <h1></h1>
        <ImageTextSection
            imageSrc="/assets/images/TinkturImage.png"
            imageAlt="Kräuter Tinktur"
            imagePosition="left"
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
            imagePosition="right"
            imagePositionMobile="bottom"
            color="red"
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
function goToBuchtipps() {
  router.push('/buchtipps')
}
</script>

<style lang="sass">

</style>