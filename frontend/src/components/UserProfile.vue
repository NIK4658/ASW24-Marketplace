<script setup>
import SinglePost from '@/components/SinglePost.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'

const userLogged = ref('')
const route = useRoute()
const router = useRouter()
const userField = ref([])
const posts = ref([])
const errorFlag = ref(false)
const loadPosts = async () => {
  try {
    const username = route.params.username
    const response = await axios.get('http://localhost:3000/users/' + username)
    userField.value = response.data

    const response2 = await axios.post('http://localhost:3000/posts/user/' + username)
    posts.value = response2.data
  } catch (error) {
    errorFlag.value = true
    console.error('Error fetching data:', error)
  }
}
onMounted(async () => {
  await loadPosts()
  const response = await axios.get('http://localhost:3000/users/session', {
    withCredentials: true,
  })
  userLogged.value = response.data.username
})

const logout = async () => {
  try {
    await axios.post('http://localhost:3000/users/session/logout', null, {
      withCredentials: true,
    })
    await router.push({name: 'login'})
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
    <img
      v-if="userField.image"
      :src="'data:' + userField.image.contentType + ';base64,' + userField.image.data"
      alt="Profile Picture"
    />
    <h1>@{{ userField.username }}</h1>
    <div v-if="userField.username === userLogged">
      <button class="icon-button" @click="logout">
        <img src="/footer/logout.ico" alt="Logout" />
      </button>
    </div>

    <div v-if="userField.username !== userLogged">
      <button @click="contactSeller">Send a message to the seller</button>
    </div>
    <div v-if="userField.username === userLogged">
      <button @click="router.push({ name: 'history' })">Order History</button>
    </div>

    <button>Reviews</button>

    <div class="grid-container">
      <div v-for="post in posts" :key="post.title" class="grid-item">
        <single-post
          :postId="post._id"
          :price="post.price"
          :title="post.title"
          :image="post.images[0]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 16px;
  padding: 5%;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  transition: transform 0.2s;
}

.grid-item:hover {
  transform: scale(1.03);
}
</style>
