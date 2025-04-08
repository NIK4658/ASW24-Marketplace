<script setup>
import {ref} from "vue";

let copied = ref(false)
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>

<template>
  <button @click="copyLink" class="secondary-btn">
    {{ copied ? 'Copied!' : 'Share Link' }}
  </button>
</template>

<style scoped>
.secondary-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: 1px solid #2196f3;
  border-radius: 4px;
  background-color: transparent;
  color: #2196f3;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.secondary-btn:hover {
  background-color: #2196f3;
  color: #fff;
}
</style>
