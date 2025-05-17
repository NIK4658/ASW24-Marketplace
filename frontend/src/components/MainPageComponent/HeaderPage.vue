<script setup>
import { ref } from 'vue'
import { useFavicon } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

const route = useRoute()
const router = useRouter()
const isDarkTheme = ref(false)
const search = ref('')

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

const handleSearch = async (event) => {
  event.preventDefault()
  search.value.trim() === ''
    ? router.push({ name: 'home' })
    : router.push({ name: 'home', query: { search: search.value } })
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
    <div class="search-container">
      <form @submit="handleSearch">
        <input type="text" v-model="search" placeholder="Search..." />
        <button type="submit">
          <!--          <img src="/header/search.ico" alt="Search" />-->
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
    </div>
    <button @click="toggleTheme" class="theme-button" v-if="isDarkTheme">
      <i class="fa-solid fa-moon"></i>
    </button>
    <button @click="toggleTheme" class="theme-button" v-else>
      <i class="fa-solid fa-sun"></i>
    </button>
  </header>
</template>

<style scoped>
header {
  top: 0;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: var(--header-height);
  background: var(--color-background);
  transition: var(--transition-color);
  box-sizing: border-box;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75%;
}

input[type='text'] {
  padding: 0.5rem;
  width: 100%;
  margin-right: 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

button[type='submit'],
.theme-button {
  padding: 0.5rem 10px;
  border: none;
  border-radius: 4px;
  background-color: var(--color-border-hover);
  color: var(--color-text);
  cursor: pointer;
  transition: backgrosund-color 0.3s;
}

svg {
  font-size: 1.1rem;
  color: var(--un-ring-color);
}

button[type='submit']:hover,
.theme-button:hover {
  background-color: var(--color-border);
}

.theme-button {
  margin-right: 7.5vw;
}

@media (min-width: 700px) {
  form {
    width: 30%;
  }
}
</style>
