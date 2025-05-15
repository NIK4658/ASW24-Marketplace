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
        <h2>{{ chat.sender.username }}</h2>
        <p>{{ chat.message }}</p>
        <span>{{ chat.formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0 8px 0;
}

h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 16px 0 12px 16px;
}

.chat-log {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-log > h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.chat-log > p {
  font-size: 1.2rem;
  margin: 0;
}

.chat-log > span {
  font-size: 1rem;
  color: #888;
}
</style>