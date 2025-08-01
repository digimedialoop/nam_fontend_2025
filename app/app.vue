<template>
  <div>
    <NuxtLayout>      
    </NuxtLayout>
  </div>    
</template>

<script setup>

const scrollY = useState('scrollY', () => 0)
const windowWidth = useState('windowWidth', () => 0)

function update() {
  scrollY.value = window.scrollY
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update)
  window.addEventListener('resize', update)
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>
