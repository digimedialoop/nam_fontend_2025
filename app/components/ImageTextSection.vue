<template>
  <section :class="[...sectionClasses, color, imagePositionMobile === 'bottom' ? 'image-bottom' : 'image-top']">
    <div class="image">
      <svg
        class="bg-shape"
        viewBox="-40 577 737 696"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M169.847,626.994C309.047,564.864,463.327,567.254,519.007,598.318C699.200,698.851,746.367,1009.329,643.127,1173.017C584.924,1265.299,550.300,1244.110,492.327,1257.847C401.890,1279.278,276.227,1289.452,81.687,1207.666C-53.788,1150.711,8.606,1060.705,-29.674,868.343C-65.416,688.735,-10.616,707.540,169.847,626.994Z"
        />
      </svg>
      <img :src="imageSrc" :alt="imageAlt" />
    </div>
    <div class="text">
      <slot />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  imageSrc: { type: String, required: true },
  imageAlt: { type: String, default: '' },
  imagePosition: { type: String, default: 'left' },      // 'left' | 'right'
  imagePositionMobile: { type: String, default: 'top' }, // 'top' | 'bottom'
  color: { type: String, default: 'green' },
})

const sectionClasses = computed(() => {
  return [
    'image-text-section',
    `image-${props.imagePosition}`,
    `mobile-${props.imagePositionMobile}`
  ]
})
</script>

<style lang="sass">
$breakpointSM: 576px
$breakpointMD: 768px
$breakpointLG: 992px

$green: #b5d0cb
$red: #c09c9c

.image-text-section
  display: flex
  gap: 2rem
  align-items: stretch
  justify-content: space-between
  margin: 6vh 0
  overflow-x: hidden

  @media (max-width: $breakpointMD)
    flex-direction: column

  &.green
    h2
      color: darken($green, 30%)
    button
      background-color: lighten($green, 12%)
    .image
      svg
        fill: $green

  &.red
    h2
      color: darken($red, 20%)
    button
      background-color: lighten($red, 17%)
    .image
      svg
        fill: $red

  &.image-right
    flex-direction: row-reverse
    .image
      align-items: flex-end
      .bg-shape
        right: -8%
        transform: scaleX(-1)
    .text
      margin-left: 15vw  

  &.image-left
    flex-direction: row
    .image
      align-items: flex-start
      .bg-shape
        left: -8%
    .text
      margin-right: 15vw

  // Mobile Positionen
  &.image-bottom
    @media (max-width: $breakpointMD)
      flex-direction: column-reverse

  &.image-top
    @media (max-width: $breakpointMD)
      flex-direction: column

  .image,
  .text
    width: 50%
    display: flex
    flex-direction: column
    justify-content: center

    @media (max-width: $breakpointMD)
      width: 100%

  .image 
    position: relative
    display: flex
    
    .bg-shape
      position: absolute
      top: 0
      width: 80%
      aspect-ratio: 1 / 1
      z-index: 1
      pointer-events: none
    img
      width: 70%
      height: auto
      display: block
      z-index: 2
      margin: 10% 10%
      position: relative

  .text
    line-height: 150%
    padding: 0
    @media (max-width: $breakpointMD)
      padding: 0 5%
      width: 90%
      margin: 0 !important
    h2
      font-size: 1.2rem
      font-style: italic
      margin: 0
    h3
      font-size: 2.8rem 
      margin: 1rem 0 1.6rem 0
      line-height: 120%
    p
      font-size: 1.3rem
      margin: .5rem 0
    button
      font-size: 1.1rem
      padding: 1rem 3rem
      border: none
      border-radius: 1rem
      text-transform: uppercase
      letter-spacing: .05rem
      margin: 1.5rem 0
      width: auto
      align-self: flex-start
      display: block
      transition: .6s
      cursor: pointer

      &:hover
        transform: scale(1.1)
</style>
