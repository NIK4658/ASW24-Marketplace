<script setup>
import SinglePost from '@/components/PostViewer/SinglePost.vue'

defineProps({
  posts: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="grid-container" v-if="posts.length > 0">
    <div v-for="post in posts" :key="post.title" class="grid-item">
      <SinglePost
        :postId="post._id"
        :price="post.price"
        :title="post.title"
        :image="post.images[0]"
      />
    </div>
  </div>
  <div v-else class="error-container">
    <p>No posts available</p>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  row-gap: 30px;
  column-gap: 30px;
  padding: 0 5%;
  width: 100%;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.error-container > p {
  font-size: 1.5rem;
}
</style>
