<script setup>
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
</script>

<template>
  <div class="chat-preview" @click="handleClick">
    <img :src="props.image" alt="Profile Picture" class="profile-pic">
    <div class="chat-details">
      <h3 class="chat-name">{{ props.username }}</h3>
      <p class="chat-message">{{ props.message }}</p>
    </div>
    <div class="chat-meta">
      <span class="chat-time">{{ props.time }}</span>
    </div>
  </div>
</template>

<style scoped>
.chat-preview {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-details {
  flex: 1;
}

.chat-name {
  margin: 0;
  font-size: 1.2em;
}

.chat-message {
  margin: 0;
  color: #666;
}

.chat-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat-time {
  font-size: 0.8em;
  color: #999;
}
</style>