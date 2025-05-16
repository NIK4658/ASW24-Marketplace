<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ChatList from '@/components/chat/ChatList.vue';

const route = useRoute()
const sessionID = ref('')
const chatPreviews = ref([])

// Load chat previews
const loadPreviews = async () => {
  try {
    const response = await axios.get(`/backend/chat/${sessionID.value}`)
    chatPreviews.value = response.data
  } catch (error) {
    console.error('Error fetching data for previews: ', error)
  }
}

// Handle chat selection, sending the user to the chat page
const handleSelectPreview = async (chatId) => {
  const response = await axios.get(`/backend/chat/data/${chatId}`)
  try {
    if (response.data.sender._id === sessionID.value) {
      endpointUsername = response.data.receiver.username
    } else if (response.data.receiver._id === sessionID.value) {
      endpointUsername = response.data.sender.username
    } else {
      throw new Error('Accessing non user related chat.')
    }
  } catch (error) {
    console.error('Error selecting chat: ', error)
  }
  await route.push({ name: 'chat', params: { username: endpointUsername } })
}

onMounted(async () => {
  const sessionData = await axios.get('/backend/users/session', {
    withCredentials: true,
  })
  sessionID.value = sessionData.data.userId
  await loadPreviews()
})
</script>

<template>
  <div class="container">
    <chat-list v-if="chatPreviews.length > 0" class="sidebar" :chats="chatPreviews"
      @select-preview="handleSelectPreview" />
    <div class="placeholder" v-else>
      No chats yet. Find an item and start a conversation!
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  min-height: 400px;
  padding: 30px 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sidebar {
  min-width: 320px;
  max-width: 400px;
  margin-right: 32px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.placeholder {
  font-size: 5vh;
  color: #666;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>