<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import GridPosts from '@/components/PostViewer/GridPosts.vue'
const posts = ref([]);
const route = useRoute()
const userField = ref([])
const errorFlag = ref(false)

const loadPosts = async () => {
  try {
    const username = route.params.username
    const response = await axios.get('http://localhost:3000/users/' + username)
    userField.value = response.data
    const response2 = await axios.get('http://localhost:3000/review/user/' + username)
    posts.value = response2.data
  } catch (error) {
    errorFlag.value = true
    console.error('Error fetching data:', error)
  }
}
onMounted(async () => {
  await loadPosts()
})
</script>

<template>
  <div>
    <h1>Reviews History</h1>
  </div>
  <GridPosts :posts="posts" v-if="posts.length > 0"/>
  <div v-else class="error-container">
    <p>No posts available</p>
  </div>
</template>

<style scoped>
main {
  width: 100%;
  margin: 0;
  padding: 1%;
}

h1{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.error-container > p {
  font-size: 1.5rem;
}
</style>
