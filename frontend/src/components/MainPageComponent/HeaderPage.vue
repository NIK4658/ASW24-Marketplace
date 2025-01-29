<script setup>
import { ref, onMounted } from 'vue'
import { useFavicon } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()
const isDarkTheme = ref(false)

const applyTheme = () => {
  const root = document.documentElement
  if (isDarkTheme.value) {
    root.setAttribute('data-theme', 'dark')
    useFavicon('/dark-favicon.ico')
  } else {
    root.setAttribute('data-theme', 'light')
    useFavicon('/light-favicon.ico')
  }
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
  applyTheme()
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark'
  } else {
    isDarkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
})
</script>

<template>
  <header v-if="route.name !== 'login' && route.name !== 'signup'">
    <form>
      <input type="text" v-model="search" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
    <button @click="toggleTheme" class="theme-button">
      Switch to {{ isDarkTheme ? 'Light' : 'Dark' }} Theme
    </button>
  </header>
</template>

<style scoped>
header {
  top: 0;
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 7%;
  background: var(--color-background);
  transition: var(--transition-color);
}
</style>
