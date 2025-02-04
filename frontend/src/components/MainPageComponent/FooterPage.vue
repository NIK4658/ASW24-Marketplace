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

const goToPostCreator = () => {
  router.push({ name: 'create-post' }).then(() => {
    window.location.reload()
  })
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/users/session', {
      withCredentials: true,
    })
    username.value = response.data.username
  } catch {
    router.push({ name: 'login' })
  }
})
</script>

<template>
  <footer>
    <button class="icon-button" @click="router.push({ name: 'home' })">
      <img src="/footer/home.ico" alt="Home" />
    </button>
    <button class="icon-button" @click="router.push({ name: 'chat' })">
      <img src="/footer/chat.ico" alt="Chat" />
    </button>
    <button class="icon-button" @click="goToPostCreator">
      <img src="/footer/plus.ico" alt="Add post" />
    </button>
    <button class="icon-button" @click="goToProfile">
      <img src="/footer/profile.ico" alt="Profile" />
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

.icon-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
}

button:hover {
  background-color: var(--color-border);
}

@media (max-width: 600px) {
  button {
    width: 3rem;
    height: 3rem;
  }
}
</style>
