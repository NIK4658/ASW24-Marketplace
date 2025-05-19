<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import axios from 'axios'

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
    const response = await axios.get('http://localhost:3000/users/session', {
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
      <font-awesome-icon :icon="['fas', 'home']" />
    </button>
    <button class="icon-button" @click="router.push({ name: 'inbox' })">
      <font-awesome-icon :icon="['fas', 'comment']" />
    </button>
    <button class="icon-button" @click="router.push({ name: 'create-post' })">
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>
    <button class="icon-button" @click="goToProfile">
      <font-awesome-icon :icon="['fas', 'user']" />
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
