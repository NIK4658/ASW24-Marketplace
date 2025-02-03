<script setup>
import SinglePost from '@/components/SinglePost.vue'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  somePost: Object,
})

const posts = ref([])
const filteredPosts = ref([])
const route = useRoute()

const loadPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/posts')
    posts.value = response.data
    filterPosts()
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}

const filterPosts = () => {
  const searchQuery = route.query.search?.toLowerCase() || ''
  filteredPosts.value = posts.value.filter((post) => post.title.toLowerCase().includes(searchQuery))
}

onMounted(() => {
  if (props.somePost) {
    posts.value = props.somePost
    filterPosts()
  } else {
    loadPosts()
  }
})

watch(route, () => {
  if (route.name === 'home') {
    loadPosts()
  }
})
</script>

<template>
  <div class="grid-container" v-if="filteredPosts.length > 0">
    <div v-for="post in filteredPosts" :key="post.title" class="grid-item">
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
  height: 100vh;
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
