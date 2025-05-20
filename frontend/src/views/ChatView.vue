<script setup>
import ChatPage from '@/components/ChatPage.vue'
</script>

<template>
  <div class="chatview-wrapper">
    <ChatPage />
  </div>
</template>

<style scoped>
.chatview-wrapper {
  box-sizing: border-box;
  max-width: 600px;
  margin: auto;
  min-height: 60vh;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 30px;
}
</style>
