<script setup>
import { computed } from 'vue';
import { format, isToday } from 'date-fns';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  image: {
    type: Object,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.id);
};

const formattedTime = computed(() => {
  const date = new Date(props.time);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else {
    return format(date, 'yyyy-MM-dd');
  }
});
</script>

<template>
  <div class="chat-preview" @click="handleClick">
    <div class="chat-info">
      <img :src="'data:' + props.image.contentType + ';base64,' + props.image.data" alt="User Image" class="chat-image" />
      <div class="chat-details">
        <p class="chat-username">{{ username }}</p>
        <p class="chat-message">{{ message }}</p>
      </div>
    </div>
    <div class="chat-meta">
      <span class="chat-time">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<style scoped>
.chat-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-preview:hover {
  background-color: #f0f0f0;
}

.chat-info {
  display: flex;
  align-items: center;
}

.chat-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-details {
  display: flex;
  flex-direction: column;
}

.chat-username {
  font-weight: bold;
}

.chat-message {
  color: #666;
}

.chat-meta {
  text-align: right;
}

.chat-time {
  color: #999;
}
</style>