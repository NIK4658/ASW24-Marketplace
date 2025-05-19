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

watch(
  () => route.query.search,
  () => {
    filterPosts()
  },
)

// import { io } from 'socket.io-client'
// const socket = io('ws://localhost:3000', {
//   withCredentials: true,
// })
// socket.on('connect', () => {
//   console.log('Connected to the server!')
// })
</script>

<!--<script setup>-->
<!--import { io } from 'socket.io-client'-->

<!--// To create connection to the server-->
<!--const socket = io('http://localhost:3000', {-->
<!--  withCredentials: true,-->
<!--})-->


<!--// To connect to the server-->
<!--socket.on('connect', () => {-->
<!--  console.log('Connected to the server!')-->
<!--})-->

<!--// To receive data from the server-->
<!--socket.on('test', (data) => {-->
<!--  console.log('Received data from the server:', data)-->
<!--})-->

<!--// To send data to the server-->
<!--const sendMessage = () => {-->
<!--  socket.emit('test', 'Hello from the client!')-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <button @click="sendMessage">-->
<!--    Send a message to the server-->
<!--  </button>-->
<!--</template>-->

<template>
  <GridPosts :posts="filteredPosts" />
</template>
