<script setup>
import { ref, watch, nextTick } from 'vue'
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

const chatLogWrapper = ref(null)

watch(
  () => props.chatLog,
  async () => {
    await nextTick()
    if (chatLogWrapper.value) {
      chatLogWrapper.value.scrollTop = chatLogWrapper.value.scrollHeight
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="chat-window">
    <h1 class="chat-title">{{ props.chatTitle }}</h1>
    <div class="chat-log-wrapper" ref="chatLogWrapper">
      <chat-log v-if="props.chatLog.length > 0" :chatTitle="props.chatTitle" :chatLog="props.chatLog" />
      <div v-else class="empty-chat-message">
        No messages yet. Start the conversation!
      </div>
    </div>
    <chat-input class="chat-input" :placeholder="props.placeholder" @send-message="handleSentMessage" />
  </div>
</template>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 65vh;
  min-height: 0;
}

.chat-title {
  text-align: center;
  font-size: 2.2em;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0 0 18px 0;
  padding: 18px 0 10px 0;
  border-bottom: 2px solid #e0e7ef;
  box-shadow: 0 2px 8px rgba(58,123,213,0.05);
}

.chat-log-wrapper {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.chat-input {
  margin-top: auto;
}

.empty-chat-message {
  text-align: center;
  color: #888;
  margin: 24px 0 12px 0;
  font-size: 1.5em;
}
</style>