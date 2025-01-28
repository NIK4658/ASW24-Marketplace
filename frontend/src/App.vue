<script setup>
import { ref, onMounted } from 'vue'
import { useFavicon } from '@vueuse/core'

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
  <button @click="toggleTheme" class="theme-button">
    Switch to {{ isDarkTheme ? 'Light' : 'Dark' }} Theme
  </button>

  <RouterView />
</template>

<style></style>
