<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ChatList from '@/components/chat/ChatList.vue';
import ChatWindow from '@/components/chat/ChatWindow.vue';

const senderId = ref('') // Reppresents the current user
const receiverId = ref('') // Reppresents the user the current user is chatting with
const chatPreviews = ref([])
const chatMessages = ref([])
const isChatSelected = ref(false)
const chatTitle = ref('')

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

const handleSelectPreview = async (chatId) => {
  try {
    const response = await axios.get(`/backend/chat/data/${chatId}`)
    if (response.data.sender === senderId.value) {
      receiverId.value = response.data.receiver
      chatTitle.value = response.data.receiverUsername
    } else if (response.data.receiver === senderId.value) {
      receiverId.value = response.data.sender
      chatTitle.value = response.data.senderUsername
    } else {
      console.error('Error selecting chat: ', response.data)
    }

    chatMessages.value = await axios.get(`/backend/chat/${senderId.value}/${receiverId.value}`)

    isChatSelected.value = true
  } catch (error) {
    console.error('Error fetching chat: ', error)
  }
}

const handleSendMessage = async (currentMessage) => {
  try {
    await axios.post('/backend/chat', {
      sender: senderId.value,
      receiver: receiverId.value,
      message: currentMessage
    })
    chatMessages.value.push({
      sender: senderId.value,
      receiver: receiverId.value,
      message: currentMessage,
      read: true
    })
  } catch (error) {
    console.error('Error sending message: ', error)
    chatMessages.value.push({
      sender: senderId.value,
      receiver: receiverId.value,
      message: "ERROR: Message not sent -> " + currentMessage,
      read: false
    })
  }
}

</script>

<template>
  <div class="container">
    <div class="layout">
      <chat-list :chats="chatPreviews" @select-preview="handleSelectPreview" />
      <chat-window v-if="isChatSelected" :chatTitle="chatTitle" :chatLog="chatMessages" @send-message="handleSendMessage"/>
    </div>
  </div>
</template>

<style scoped>

</style>