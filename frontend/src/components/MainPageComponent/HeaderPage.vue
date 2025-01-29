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
    <div class="search-container">
      <form>
        <input type="text" v-model="search" placeholder="Search..." />
        <button type="submit">
          <img src="/header/search.ico" alt="Search" />
        </button>
      </form>
    </div>
    <button @click="toggleTheme" class="theme-button">
      <img v-if="isDarkTheme" src="/header/moon.ico" alt="Dark Mode" />
      <img v-else src="/header/sun.ico" alt="Light Mode" />
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
  height: 7%;
  background: var(--color-background);
  transition: var(--transition-color);
  padding: 0 20px;
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
  width: 30%;
}

input[type="text"] {
  padding: 0.5rem;
  width: 100%;
  margin-right: 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

button[type="submit"], .theme-button {
  padding: 0.5rem 10px;
  border: none;
  border-radius: 4px;
  background-color: var(--color-border-hover);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover, .theme-button:hover {
  background-color: var(--color-border);
}

button[type="submit"] img {
  width: 20px;
  height: 20px;
}

.theme-button img {
  width: 20px;
  height: 20px;
}

@media (max-width: 600px) {
  header {
    height: auto;
    align-items: flex-start;
    padding: 10px;
  }

  .search-container {
    width: 100%;
    margin-bottom: 10px;
  }

  form {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-right: 10px;
  }

  input[type="text"] {
    width: calc(100% - 20px);
    margin-right: 10px;
  }

  .theme-button img {
    width: 20px;
    height: 20px;
  }
}
</style>
