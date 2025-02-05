<script setup>
const props = defineProps({
  chatTitle: {
    type: String,
    required: true
  },
  chatLog: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="container">
    <h1>{{ props.chatTitle }}</h1>
    <div class="chat-log">
      <div v-for="chat in props.chatLog" :key="chat._id">
        <h2>{{ chat.sender.username }} to {{ chat.receiver.username }}</h2>
        <p>{{ chat.message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>