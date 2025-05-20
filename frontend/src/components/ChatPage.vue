<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ChatWindow from '@/components/chat/ChatWindow.vue';
import { socket } from "@/socket.js";

const route = useRoute()
const sessionID = ref('')
const sessionData = ref([])
const endpointSessionID = ref('')
const endpointUserData = ref({})
const chatMessages = ref([])
const room = ref("");
const chatTitle = ref('')

// Load chat logs between users
const loadChat = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/chat/between/${sessionID.value}/${endpointSessionID.value}`)
    chatMessages.value = response.data
  } catch (error) {
    console.error('Error fetching chat log between users: ', error)
  }
}

// Setup socket connection with room
const setupSocketRoom = async () => {
  const response = await axios.post('http://localhost:3000/room', {
    user1: sessionID.value,
    user2: endpointSessionID.value
  });
  room.value = response.data;
  socket.value.emit('joinRoom', { roomId: room.value._id, username: sessionData.value.data.username });
}

// Set sender as read
const setSenderRead = async () => {
  try {
    const response = await axios.post(`http://localhost:3000/chat/between/${endpointSessionID.value}/${sessionID.value}`)
  } catch (error) {
    console.error('Error setting sender as read: ', error)
  }
}

// Handle chat sending
const handleSendMessage = async (currentMessage) => {
  try {
    const loggedChat = await axios.post(`http://localhost:3000/chat`, {
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
  const response = await axios.get('http://localhost:3000/users/session', {
    withCredentials: true,
  })

  sessionID.value = response.data.userId
  sessionData.value = await axios.get(`http://localhost:3000/users/id/${sessionID.value}`);
  endpointUserData.value = await axios.get(`http://localhost:3000/users/${route.params.username}`);
  endpointSessionID.value = endpointUserData.value.data._id;
  chatTitle.value = endpointUserData.value.data.username;

  await setupSocketRoom()
  await loadChat()
  await setSenderRead()
})

onUnmounted(() => {
  try {
    socket.value.emit('leaveRoom', { roomId: room.value._id, username: sessionData.value.data.username })
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
