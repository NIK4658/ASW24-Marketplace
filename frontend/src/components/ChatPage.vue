<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ChatList from '@/components/chat/ChatList.vue';
import ChatWindow from '@/components/chat/ChatWindow.vue';

const senderId = ref('')
const receiverId = ref('')
const chatPreviews = ref([])
const chatMessages = ref([])

const loadPreviews = async (id) => {
  try {
    const response = await axios.get(`/backend/chat/${id}`)
    chatPreviews.value = response.data
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}

onMounted(async () => {
  const response = await axios.get('/backend/users/session', {
    withCredentials: true,
  })
  senderId.value = response.data.userId
  await loadPreviews(senderId.value)
})

</script>

<template>
  <div class="container">
    <div class="layout">
      <chat-list :chats="chatPreviews" />  
    </div>
  </div>
</template>

<style scoped>

</style>