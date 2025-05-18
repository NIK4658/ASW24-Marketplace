<script setup>
import axios from 'axios'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { format, isToday } from 'date-fns';

const sessionID = ref('')
const readForUser = ref(false)

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  image: {
    type: Object,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.id)
}

const formattedTime = computed(() => {
  const date = new Date(props.time)
  if (isToday(date)) {
    return format(date, 'HH:mm')
  } else {
    return format(date, 'yyyy-MM-dd')
  }
});

const updateReadForUser = async () => {
  if (sessionID.value === props.sender) {
    readForUser.value = true;
  } else if (sessionID.value !== props.sender && props.read === false) {
    readForUser.value = false;
  } else if (sessionID.value !== props.sender && props.read === true) {
    readForUser.value = true;
  }
};

onMounted(async () => {
  const sessionData = await axios.get('/backend/users/session', {
    withCredentials: true,
  });
  sessionID.value = sessionData.data.userId;
  updateReadForUser();
});

watch(
  () => [props.read, props.sender, sessionID.value],
  () => {
    updateReadForUser();
  }
);
</script>

<template>
  <div class="chat-preview" @click="handleClick">
    <div class="chat-info">
      <span v-if="!readForUser" class="chat-read-emoji">✉</span>
      <img :src="'data:' + props.image.contentType + ';base64,' + props.image.data" alt="User Image"
        class="chat-image" />
      <div class="chat-details">
        <p class="chat-username">{{ username }}</p>
        <p class="chat-message">
          <span v-if="sessionID === props.sender">⤴ </span>{{ message }}
        </p>
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
  background-color: var(--color-border-hover);
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
  color: var(--color-text);
}

.chat-meta {
  text-align: right;
}

.chat-time {
  color: var(--color-text);
}

.chat-read-emoji {
  font-size: 20px;
  margin-right: 8px;
}
</style>
