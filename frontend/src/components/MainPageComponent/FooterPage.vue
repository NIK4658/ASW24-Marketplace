<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

const router = useRouter()
const username = ref('')

const goToProfile = () => {
  if (username.value === '') {
    router.push({ name: 'login' })
    return
  }
  router.push({ name: 'profile', params: { username: username.value } })
}

onMounted(async () => {
  try {
    const response = await axios.get('/backend/users/session', {
      withCredentials: true,
    })
    username.value = response.data.username
  } catch {
    await router.push({ name: 'login' })
  }
})
</script>

<template>
  <footer>
    <button class="icon-button" @click="router.push({ name: 'home' })">
      <i class="fa-solid fa-house"></i>
    </button>
    <button class="icon-button" @click="router.push({ name: 'inbox' })">
      <i class="fa-solid fa-comment"></i>
    </button>
    <button class="icon-button" @click="router.push({ name: 'create-post' })">
      <i class="fa-solid fa-plus"></i>
    </button>
    <button class="icon-button" @click="goToProfile">
      <i class="fa-solid fa-user"></i>
    </button>
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: var(--footer-height);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background);
  transition: var(--transition-color);
}

button {
  width: 4rem;
  height: 4rem;
  border: none;
  margin: auto 10px;
  background-color: var(--color-border-hover);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: var(--color-border);
}

.icon-button svg {
  font-size: 2rem;
  color: var(--un-ring-color);
}
</style>
