<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue';
import io from 'socket.io-client';

const { product } = defineProps({
  product: Object,
  userLogged: String,
});

const socket = ref(null);
const notifications = ref([]);

const connectSocket = () => {
  socket.value = io('http://localhost:3000', {
    withCredentials: true,
  });

  socket.value.on('buyNotificationClient', () => {
    console.log('Buy Notification received:');
  });
};

const sendNotification = () => {
  socket.value.emit('buyNotificationServer', { targetUser: product.seller.username });
};

onMounted(() => {
  connectSocket();
});

//onBeforeUnmount(() => {
//  if (socket.value) {
    //socket.value.disconnect();
//  }
//});
</script>

<template>
  <div>
    <h2>Notifiche</h2>
    <ul>
      <li v-for="(notification, index) in notifications" :key="index">
        {{ notification }}
      </li>
    </ul>
    <button @click="sendNotification">
      Send Notifications
    </button>
  </div>
</template>

<style scoped>

</style>
