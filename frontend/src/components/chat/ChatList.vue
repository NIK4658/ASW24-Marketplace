<script setup>
import { ref } from 'vue';
import ChatPreview from '@/components/chat/ChatPreview.vue';

const props = defineProps({
  chats: {
    type: Array,
    default: () => []
  }
});

const selectedChatId = ref('');

const emit = defineEmits(['select-preview']);

const handleSelectPreview = (chatId) => {
  emit('select-preview', chatId);
  selectedChatId.value = chatId; 
};
</script>

<template>
  <div class="container">
    <ul>
      <chat-preview v-for="chat in props.chats" :id="chat._id" :image="chat.image" :username="chat.username"
        :message="chat.message" :time="chat.time" :read="chat.read" @click="handleSelectPreview" />
    </ul>
  </div>
</template>

<style scoped>

</style>