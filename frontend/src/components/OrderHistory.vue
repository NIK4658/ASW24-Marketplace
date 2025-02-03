<script setup>
import SinglePost from "@/components/SinglePost.vue";
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
const posts = ref([]);
const route = useRoute()
const userField = ref([])
const errorFlag = ref(false)

const loadPosts = async () => {
  try {
    const username = route.params.username
    const response = await axios.get('http://localhost:3000/users/' + username)
    userField.value = response.data
    const response2 = await axios.post('http://localhost:3000/posts/user/history/' + username)
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
    <h1>Order History</h1>
  </div>
  <div class="grid-container" v-if="posts.length > 0">
    <div v-for="post in posts" :key="post.title" class="grid-item">
      <SinglePost
        :postId="post._id"
        :price="post.price"
        :title="post.title"
        :image="post.images[0]"
      />
    </div>
  </div>
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

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  row-gap: 30px;
  column-gap: 30px;
  padding: 5%;
  width: 100%;
}

h1{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.grid-item {
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

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
