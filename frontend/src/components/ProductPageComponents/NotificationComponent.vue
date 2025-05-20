<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')

function show(msg, duration = 3000) {
  message.value = msg
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({ show })
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="popup">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<style scoped>
.popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #323232;
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 1000;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
