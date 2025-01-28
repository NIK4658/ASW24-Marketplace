<script setup>
defineProps({
  image: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: [String, Number],
    required: true
  }
});
</script>

<template>
  <div class="post">
    <img :src="'data:' + image.contentType + ';base64,' + image.data" alt="Post Image"
         class="post-image" />
    <div class="post-details">
      <h2 class="post-title">{{ title }}</h2>
      <p class="post-price">{{ price }} &euro;</p>
    </div>
  </div>
</template>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.post:hover {
  transform: scale(1.03);
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-details {
  padding: 16px;
}

.post-title {
  font-size: 18px;
  margin: 0 0 8px;
  color: #333;
}

.post-price {
  font-size: 16px;
  margin: 0 0 4px;
  color: #007bff;
  font-weight: bold;
}
</style>
