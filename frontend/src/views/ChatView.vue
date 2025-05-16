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
  padding-top: var(--header-height);
  padding-bottom: var(--footer-height);
  box-sizing: border-box;
}
</style>
