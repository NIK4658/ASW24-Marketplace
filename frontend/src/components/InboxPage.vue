<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ChatList from '@/components/chat/ChatList.vue'
import { socket } from '@/socket.js'

const router = useRouter()
const sessionID = ref('')
const chatPreviews = ref([])
const endpointUsername = ref('')

// Load chat previews
const loadPreviews = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/chat/${sessionID.value}`)
    chatPreviews.value = response.data
  } catch (error) {
    console.error('Error fetching data for previews: ', error)
  }
}

// Handle chat selection, sending the user to the chat page
const handleSelectPreview = async (chatId) => {
  const response = await axios.get(`http://localhost:3000/chat/data/${chatId}`)
  try {
    if (response.data.sender._id === sessionID.value) {
      endpointUsername.value = response.data.receiver.username
    } else if (response.data.receiver._id === sessionID.value) {
      endpointUsername.value = response.data.sender.username
    } else {
      throw new Error('Accessing non user related chat.')
    }
  } catch (error) {
    console.error('Error selecting chat: ', error)
  }
  await router.push({ name: 'chat', params: { username: endpointUsername.value } })
}

onMounted(async () => {
  const sessionData = await axios.get('http://localhost:3000/users/session', {
    withCredentials: true,
  })
  sessionID.value = sessionData.data.userId
  await loadPreviews()
})

onUnmounted(() => {
  chatPreviews.value = []
  sessionID.value = ''
  endpointUsername.value = ''
  socket.value.off('newMessageNotificationClient')
})

socket.value.on('newMessageNotificationClient', () => {
  loadPreviews()
})
</script>

<template>
  <div class="container">
    <chat-list
      v-if="chatPreviews.length > 0"
      :chats="chatPreviews"
      @select-preview="handleSelectPreview"
    />
    <div class="placeholder" v-else>
      <p>No chats yet.</p>
      <br />
      <p>Find an item and start a conversation!</p>
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  width: 100%;
  height: 100%;
  font-size: 5vh;
  color: var(--color-text);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container {
  max-width: 600px;
  min-height: 60vh;
  margin: auto;
  padding: 20px;
  background-color: var(--color-background-soft);
  border-radius: 8px;
}
</style>
