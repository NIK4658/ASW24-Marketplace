<script setup>
import { reactive } from 'vue';
import ChatPreview from '@/components/chat/ChatPreview.vue';

const props = defineProps({
  chats: {
    type: Array,
    default: () => []
  }
});

function handleChatClick(chatId) {
  // TODO: Handle chat click
}
</script>

<template>
  <div class="container">
    <ul>
      <chat-preview v-for="chat in chats" :id="chat._id" :image="chat.image" :username="chat.username"
        :message="chat.message" :time="chat.time" :read="chat.read" @click="handleChatClick(chat.id)" />
    </ul>
  </div>
</template>

<style scoped>
.container {
  width: 300px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>