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

</style>