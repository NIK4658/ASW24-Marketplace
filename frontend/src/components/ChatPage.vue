<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import io from 'socket.io-client'
import ChatWindow from '@/components/chat/ChatWindow.vue';

const route = useRoute()
const sessionID = ref('')
const sessionData = ref({})
const endpointSessionID = ref('')
const endpointUserData = ref({})
const chatMessages = ref([])

// Socket
const socket = io('http://localhost:3000');
const room = ref("");

// Load chat logs between users
const loadChat = async () => {
  try {
    const response = await axios.get(`/backend/chat/between/${sessionID.value}/${endpointSessionID.value}`)
    chatMessages.value = response.data
  } catch (error) {
    console.error('Error fetching chat log between users: ', error)
  }
}

// Setup socket connection with room
const setupSocketRoom = async () => {
  room.value = await axios.get(`/backend/chat/room/${sessionID.value}/${endpointSessionID.value}`)
  socket.emit('joinRoom', { roomId: room.value, username: sessionData.value.username })
}

// Handle chat sending
const handleSendMessage = async (currentMessage) => {
  try {
    const loggedChat = await axios.post(`/backend/chat`, {
      sender: sessionID.value,
      receiver: endpointSessionID.value,
      message: currentMessage
    })
    socket.emit('sendMessage', { chat: loggedChat.data, roomId: room.value._id })
  } catch (error) {
    console.error('Error sending message: ', error)
  }
}

onMounted(async () => {
  const response = await axios.get('/backend/users/session', {
    withCredentials: true,
  })

  sessionID.value = response.data.userId
  sessionData = await axios.get(`/backend/users/${sessionID.value}`);
  endpointUserData = await axios.get(`/backend/users/${route.params.username}`);
  endpointSessionID = endpointUserData.data._id;

  await setupSocketRoom()
  await loadChat()
})

onUnmounted(() => {
  try {
    socket.emit('leaveRoom', { roomId: room.value, username: sessionData.value.username })
  } catch (error) {
    console.error('Error sending message: ', error)
  }
})

socket.on('receiveMessage', (message) => {
  chatMessages.value.push(message)
})
</script>

<template>
  <chat-window :chatTitle="chatTitle" :chatLog="chatMessages" @send-message="handleSendMessage" />
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.layout {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 300px;
  background-color: #f0f0f0;
  border-right: 1px solid #ccc;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.back-btn {
  margin: 16px;
  padding: 8px 16px;
  font-size: 1rem;
  align-self: flex-start;
  cursor: pointer;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  color: #888;
}
</style>