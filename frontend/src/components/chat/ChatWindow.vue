<script setup>
import { ref } from 'vue'
import ChatLog from '@/components/chat/ChatLog.vue'
import ChatInput from '@/components/chat/ChatInput.vue'

const props = defineProps({
  chatTitle: {
    type: String,
    required: true
  },
  chatLog: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: "Send a message..."
  }
});

const inputValue = ref('');

const emit = defineEmits(['send-message']);

const handleSentMessage = (message) => {
  if (message.trim() !== '') {
    emit('send-message', message);
    inputValue.value = ''; 
  }
};
</script>

<template>
  <div class="chat-window">
    <chat-log :chatTitle="props.chatTitle" :chatLog="props.chatLog" />
    <chat-input class="chat-input" :placeholder="props.placeholder" @send-message="handleSentMessage" />
  </div>
</template>

<style scoped>

</style>