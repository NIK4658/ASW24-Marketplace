<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GridPosts from '@/components/PostViewer/GridPosts.vue'

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
  filteredPosts.value = filteredPosts.value.filter((post) => post.buyer === null)
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

watch(() => route.query.search, () => {
  filterPosts()
})
</script>

<template>
  <GridPosts :posts="filteredPosts" />
</template>
