<script setup>
import { ref } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: "Send a message..."
  }
});

const emit = defineEmits(['send-message']);

const inputValue = ref('');

const sendMessage = () => {
  if (inputValue.value.trim() !== '') {
    emit('send-message', inputValue.value);
    inputValue.value = ''; 
  }
};
</script>

<template>
  <div class="chat-input">
    <input
      type="text"
      v-model="inputValue"
      :placeholder="placeholder"
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid #e0e0e0;
}

.chat-input input[type="text"] {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 20px;
  font-size: 1rem;
  outline: none;
  margin-right: 10px;
  transition: border-color 0.2s;
}

.chat-input input[type="text"]:focus {
  border-color: #1976d2;
}

.chat-input button {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.chat-input button:hover {
  background: #1565c0;
}
</style>