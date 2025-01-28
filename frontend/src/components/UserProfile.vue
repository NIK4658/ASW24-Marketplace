<script setup>
import SinglePost from "@/components/SinglePost.vue";
import axios from "axios";
import {onMounted, ref} from "vue";
const posts = ref([]);
const loadPosts = async () => {
  try {
    const response = await axios.get("http://localhost:3000/posts");
    posts.value = response.data;
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
  }
};
onMounted(() => {
  loadPosts();
});

</script>

<template>
  <div class="grid-container">
    <div v-for="post in posts" :key="post.title" class="grid-item">
      <single-post
        :price="post.price"
        :title="post.title"
        :image="post.images[0]"
      />
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 16px;
  padding: 5%;
}

.grid-item {
  width: 100%;
}
</style>
