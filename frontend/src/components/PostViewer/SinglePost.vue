<script setup>
defineProps({
  postId: {
    type: String,
    required: true,
  },
  image: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: [String, Number],
    required: true,
  },
})
</script>

<template>
  <RouterLink :to="{ name: 'product page', params: { id: postId } }">
    <div class="post">
      <img
        :src="'data:' + image.contentType + ';base64,' + image.data"
        alt="Post Image"
        class="post-image"
      />
      <div class="post-details">
        <h2 class="post-price">{{ price }} &euro;</h2>
        <p class="post-title">{{ title }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family:
    open sans,
    sans-serif;
  margin-bottom: 10px;
}

a {
  text-decoration: none;
}

.post-image {
  border-radius: 8px;
  width: 250px;
  height: 250px;
  object-fit: cover;
}

.post-details {
  padding: 10px 0 10px 0;
}

.post-title {
  text-decoration: none;
  font-size: 15px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

.post-price {
  font-size: 18px;
  color: var(--color-text);
  font-weight: bold;
}
</style>
