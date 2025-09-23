<script setup lang="ts">
interface Props {
  showDis?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDis: false
})
</script>

<template>
  <section class="adDisclaimer" v-if="showDis">
    <p>
      <b>Info</b><span>*</span> 
      Diese Seite nimmt am Amazon-Partnerprogramm teil. 
      Durch die Nutzung der Links kannst du meine Arbeit unterstützen. 
      (Es entstehen für dich keine Mehrkosten)
    </p>
  </section>
</template>

<style lang="sass">
.adDisclaimer
    background-color: lighten($gold, 16%)
    padding: .2rem 1rem
    border-radius: 1rem
    p
      font-size: 1rem !important
      color: rgba(black, .6)
</style>