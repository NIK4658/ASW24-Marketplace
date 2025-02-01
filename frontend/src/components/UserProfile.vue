<script setup>
import SinglePost from '@/components/SinglePost.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userField = ref([])
const posts = ref([])
const errorFlag = ref(false)
const loadPosts = async () => {
  try {
    const username = route.params.username
    const response = await axios.get('http://localhost:3000/users/' + username)
    userField.value = response.data

    const response2 = await axios.post('http://localhost:3000/posts/' + username)
    posts.value = response2.data
  } catch (error) {
    errorFlag.value = true
    console.error('Error fetching data:', error)
  }
}
onMounted(() => {
  loadPosts()
})
</script>

<template>
  <div v-if="errorFlag">
    <h1>User not found</h1>
  </div>
  <div v-else>
    <h1>Username: {{ userField.username }}</h1>
    <h2>Email: {{ userField.email }}</h2>

    <img
      v-if="userField.image"
      :src="'data:' + userField.image.contentType + ';base64,' + userField.image.data"
      alt="Profile Picture"
    />

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
