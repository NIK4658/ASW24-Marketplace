<script setup>
import HeaderPage from '@/components/MainPageComponent/HeaderPage.vue'
import FooterPage from '@/components/MainPageComponent/FooterPage.vue'
import SinglePost from '@/components/SinglePost.vue'

import axios from 'axios'
import { onMounted, ref } from 'vue'

const posts = ref([])
const loadPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/posts')
    posts.value = response.data
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
onMounted(() => {
  loadPosts()
})
</script>

<template>
  <HeaderPage />

  <main>
    <div class="grid-container">
      <div v-for="post in posts" :key="post.title" class="grid-item">
        <SinglePost :postId="post._id" :price="post.price" :title="post.title" :image="post.images[0]" />
      </div>
    </div>
  </main>

  <FooterPage />
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

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
