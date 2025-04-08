<script setup>
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

const { product, userLogged } = defineProps({
  product: Object,
  userLogged: String,
});

const route = useRoute();
const router = useRouter();

const editPost = () => {
  router.push({
    name: 'create-post',
    query: {
      id: product._id,
    },
  })
}

const deletePost = async () => {
  try {
    const postId = route.params.id
    await axios.delete('/backend/posts/' + postId)
    await router.push({ name: 'profile', params: { username: userLogged } }).then(() => {
      window.location.reload()
    })
  } catch (error) {
    console.error('Error deleting the post: ', error)
  }
}

</script>

<template>
  <div class="private-actions" v-if="product.seller.username === userLogged">
    <button
      :disabled="!(product.buyer === null || product.buyer === undefined)"
      :class="{
              'danger-btn': product.buyer === null || product.buyer === undefined,
              'disabled-btn': !(product.buyer === null || product.buyer === undefined),
            }"
      @click="deletePost"
    >
      Delete Post
    </button>
    <button
      :disabled="!(product.buyer === null || product.buyer === undefined)"
      :class="{
              'edit-btn': product.buyer === null || product.buyer === undefined,
              'disabled-btn': !(product.buyer === null || product.buyer === undefined),
            }"
      @click="editPost"
    >
      Edit Post
    </button>
  </div>
</template>

<style scoped>
.seller-info a {
  color: #2196f3;
  text-decoration: none;
}

.seller-info a:hover {
  text-decoration: underline;
}

.private-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.danger-btn {
  background-color: #ff5722;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.danger-btn:hover {
  background-color: #e64a19;
}

.disabled-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.edit-btn {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #388e3c;
}

</style>
