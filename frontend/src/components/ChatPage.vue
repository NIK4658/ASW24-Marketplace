<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import io from 'socket.io-client'
import ChatWindow from '@/components/chat/ChatWindow.vue';
import { socket } from "@/socket.js";

const route = useRoute()
const sessionID = ref('')
const sessionData = ref([])
const endpointSessionID = ref('')
const endpointUserData = ref({})
const chatMessages = ref([])
const room = ref("");

const chatTitle = ref('The game')

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
  const response = await axios.post('/backend/room', {
    user1: sessionID.value,
    user2: endpointSessionID.value
  });
  room.value = response.data;
  socket.value.emit('joinRoom', { roomId: room.value._id, username: sessionData.value.data.username });
}

// Handle chat sending
const handleSendMessage = async (currentMessage) => {
  try {
    const loggedChat = await axios.post(`/backend/chat`, {
      sender: sessionID.value,
      receiver: endpointSessionID.value,
      message: currentMessage
    })
    socket.value.emit('sendMessage', { message: loggedChat.data, roomId: room.value._id })
    socket.value.emit("sendMessageNotificationServer", {
      targetUser: route.params.username
    })
  } catch (error) {
    console.error('Error sending message: ', error)
  }
}

onMounted(async () => {
  const response = await axios.get('/backend/users/session', {
    withCredentials: true,
  })

  sessionID.value = response.data.userId
  sessionData.value = await axios.get(`/backend/users/id/${sessionID.value}`);
  endpointUserData.value = await axios.get(`/backend/users/${route.params.username}`);
  endpointSessionID.value = endpointUserData.value.data._id;

  await setupSocketRoom()
  await loadChat()
})

onUnmounted(() => {
  try {
    socket.emit('leaveRoom', { roomId: room.value._id, username: sessionData.value.data.username })
  } catch (error) {
    console.error('Error sending message: ', error)
  }
})

socket.value.on('receiveMessage', (message) => {
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