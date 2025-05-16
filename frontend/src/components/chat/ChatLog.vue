<script setup>
import { defineProps } from 'vue';
import { computed } from 'vue';
import { format, isToday } from 'date-fns';

const props = defineProps({
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
  <div class="chat-log">
    <div v-for="chat in formattedChatLog" :key="chat._id">
      <h2>{{ chat.sender.username }}</h2>
      <p>{{ chat.message }}</p>
      <span>{{ chat.formattedTime }}</span>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 16px 0 12px 16px;
}

.chat-log {
  flex: 1;
  padding: 0 16px 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-log>h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.chat-log>p {
  font-size: 1.2rem;
  margin: 0;
}

.chat-log>span {
  font-size: 1rem;
  color: #888;
}
</style>