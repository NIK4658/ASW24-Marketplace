<script setup>
defineProps({
  product: Object,
  userLogged: String,
});
</script>

<template>
  <button v-if="product?.seller?.username !== userLogged" class="secondary-btn">
    Send a message to the seller
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
