<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ChatList from '@/components/chat/ChatList.vue';
import ChatWindow from '@/components/chat/ChatWindow.vue';

// DEBUG ONLY
const zettaiki = ref('67a0a82156a2067630e6e34f')
const zettaiki2 = ref('67a38bb594dbd6b9fdd9dc37')
const message1 = ref('Hello, how are you?')
const message2 = ref('I am fine, thank you. How about you?')
// DEBUG ONLY

const senderId = ref('') // Reppresents the current user
const senderUsername = ref('') // Reppresents the current user's username
const receiverId = ref('') // Reppresents the user the current user is chatting with
const receiverUsername = ref('') // Reppresents the user the current user is chatting with
const chatPreviews = ref([])
const chatMessages = ref([])
const isChatSelected = ref(false)

const loadPreviews = async (id) => {
  try {
    const response = await axios.get(`/backend/chat/${id}`)
    chatPreviews.value = response.data
    console.log('Chat previews: ', chatPreviews.value)
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

const handleSelectPreview = async (chatId) => {
  try {
    const response = await axios.get(`/backend/chat/data/${chatId}`)
    if (response.data.sender._id === senderId.value) {
      receiverId.value = response.data.receiver._id
      receiverUsername.value = response.data.receiver.username
    } else if (response.data.receiver._id === senderId.value) {
      receiverId.value = response.data.sender._id
      receiverUsername.value = response.data.sender.username
    } else {
      console.error('Error selecting chat: ', response.data)
    }
    const chatLogResponse = await axios.get(`/backend/chat/between/${senderId.value}/${receiverId.value}`)
    chatMessages.value = chatLogResponse.data
    console.log('Chat messages: ', chatMessages.value)
    isChatSelected.value = true
  } catch (error) {
    console.error('Error fetching chat: ', error)
  }
}

const handleSendMessage = async (currentMessage) => {
  try {
    const registeredChat = await axios.post('/backend/chat', {
      sender: senderId.value,
      receiver: receiverId.value,
      message: currentMessage
    })
    console.log('Registered chat: ', registeredChat.data)
    chatMessages.value.push(registeredChat.data)
    console.log("Succesfully sent message: ", currentMessage)
  } catch (error) {
    console.error('Error sending message: ', error)
  }
}

</script>

<template>
  <div class="container">
    <div class="layout">
      <chat-list class="chat-list" :chats="chatPreviews" @select-preview="handleSelectPreview" />
      <chat-window class="chat-window" :chatTitle="receiverUsername" :chatLog="chatMessages" @send-message="handleSendMessage" />
    </div>
  </div>
</template>

<style scoped>

</style>