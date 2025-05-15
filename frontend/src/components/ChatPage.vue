<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import io from 'socket.io-client'
import ChatList from '@/components/chat/ChatList.vue';
import ChatWindow from '@/components/chat/ChatWindow.vue';

// User data
const sessionUserID = ref('') // The username ID of the current user logged in
const otherUserID = ref('') // The username ID of the user selected to chat with
const chatTitle = ref('') // The username of the user selected to chat with

// Chat data
const chatPreviews = ref([])
const chatMessages = ref([])

// Socket
const socket = io('http://localhost:3000');
const room = ref("");

const handleSelectPreview = async (chatId) => {
  try {
    // Set other user ID and chat title
    const selectedChatData = await axios.get(`/backend/chat/data/${chatId}`)
    if (selectedChatData.data.sender._id === sessionUserID.value) {
      otherUserID.value = selectedChatData.data.receiver._id
      chatTitle.value = selectedChatData.data.receiver.username
    } else {
      otherUserID.value = selectedChatData.data.sender._id
      chatTitle.value = selectedChatData.data.sender.username
    }
  } catch (error) {
    console.error('Error fetching user data: ', error)
  }

  try {
    // Load chat messages
    const selectedChatMessages = await axios.get(`/backend/chat/between/${sessionUserID.value}/${otherUserID.value}`)
    chatMessages.value = selectedChatMessages.data
  } catch (error) {
    console.error('Error fetching chat data: ', error)
  }

  try {
    // Join chat room
    if (room.value !== "") {
      socket.emit('disconnect')
      await axios.delete(`/backend/room/${room.value._id}`)
      room.value = ""
    }
    const chatRoom = await axios.post(`/backend/room`, {
      user1: sessionUserID.value,
      user2: otherUserID.value
    })
    socket.emit('joinRoom', chatRoom.data._id)
  } catch (error) {
    console.error('Error joining room: ', error)
  }
}

const handleSendMessage = async (currentMessage) => {
  try {
    const loggedChat = await axios.post(`/backend/chat`, {
      sender: sessionUserID.value,
      receiver: otherUserID.value,
      message: currentMessage
    })
    socket.emit('sendMessage', {chat: loggedChat.data, roomId: room.value._id})
  } catch (error) {
    console.error('Error sending message: ', error)
  }
}

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
  sessionUserID.value = response.data.userId
  await loadPreviews(sessionUserID.value)
})

socket.on('receiveMessage', (message) => {
  chatMessages.value.push(message)
})
</script>

<template>
  <div class="container">
    <div class="layout">
      <chat-list
        class="sidebar"
        :chats="chatPreviews"
        @select-preview="handleSelectPreview"
      />
      <div class="chat-content">
        <chat-window
          v-if="chatTitle"
          :chatTitle="chatTitle"
          :chatLog="chatMessages"
          @send-message="handleSendMessage"
        />
        <div v-else class="placeholder">
          Seleziona una chat per iniziare a conversare.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 20%;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #999;
}
</style>