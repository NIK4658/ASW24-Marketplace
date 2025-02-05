<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GridPosts from '@/components/PostViewer/GridPosts.vue'

const userLogged = ref('')
const route = useRoute()
const router = useRouter()
const userField = ref([])
const posts = ref([])
const errorFlag = ref(false)
const loadPosts = async () => {
  try {
    const username = route.params.username
    const getUserField = await axios.get('/backend/users/' + username)
    userField.value = getUserField.data

    const getUserPosts = await axios.post('/backend/posts/user/' + username)
    posts.value = getUserPosts.data.filter((post) => post.buyer === null)

    const getCurrentUserLogged = await axios.get('/backend/users/session', {
      withCredentials: true,
    })
    userLogged.value = getCurrentUserLogged.data.username
  } catch (error) {
    errorFlag.value = true
    console.error('Error fetching data:', error)
  }
}
onMounted(async () => {
  await loadPosts()
})

watch(() => route.params.username, async () => {
  await loadPosts()
})

const logout = async () => {
  try {
    await axios.post('/backend/users/session/logout', null, {
      withCredentials: true,
    })
    await router.push({ name: 'login' })
  } catch (error) {
    console.error('Error during logout:', error)
  }
}
</script>

<template>
  <div v-if="errorFlag">
    <h1>User not found</h1>
  </div>
  <div v-else>
    <div class="user-info">
      <img
        v-if="userField.image"
        :src="'data:' + userField.image.contentType + ';base64,' + userField.image.data"
        alt="Profile Picture"
        class="profile-image"
      />
      <h1>@{{ userField.username }}</h1>
      <div class="user-buttons">
        <button v-if="userField.username === userLogged" class="icon-button" @click="logout">
          Logout
        </button>
        <button v-if="userField.username === userLogged" @click="router.push({ name: 'history' })">
          Purchase History
        </button>
        <button @click="router.push({ name: 'history' })">Sales History</button>
        <button>Reviews</button>
      </div>
    </div>
    <GridPosts :posts="posts" />
  </div>
</template>

<style scoped>
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
  gap: 20px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.user-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 0;
}

button {
  padding: 5px 30px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #ededed;
}
</style>
