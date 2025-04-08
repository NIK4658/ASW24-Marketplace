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

</style>
