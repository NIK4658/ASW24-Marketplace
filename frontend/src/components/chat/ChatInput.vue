<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: "Send a message..."
  },
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);

const sendMessage = () => {
  if (inputValue.value.trim() !== '') {
    emit('update:modelValue', inputValue.value);
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