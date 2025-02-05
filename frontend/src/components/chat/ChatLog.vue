<script setup>
import { defineProps } from 'vue';
import { computed } from 'vue';
import { format, isToday } from 'date-fns';

const props = defineProps({
  chatTitle: {
    type: String,
    required: true
  },
  chatLog: {
    type: Array,
    required: true
  }
});

const formatTime = (time) => {
  const date = new Date(time);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else {
    return format(date, 'yyyy-MM-dd');
  }
};

const formattedChatLog = computed(() => {
  return props.chatLog.map(chat => ({
    ...chat,
    formattedTime: formatTime(chat.createdAt)
  }));
});
</script>

<template>
  <div class="container">
    <h1>{{ props.chatTitle }}</h1>
    <div class="chat-log">
      <div v-for="chat in formattedChatLog" :key="chat._id">
        <h2>{{ chat.sender.username }} to {{ chat.receiver.username }}</h2>
        <p>{{ chat.message }}</p>
        <span>{{ chat.formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>