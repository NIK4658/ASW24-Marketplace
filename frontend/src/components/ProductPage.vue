<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const errorFlag = ref(false)
const userLogged = ref('')
let copied = ref(false)

const loadProduct = async () => {
  try {
    const postId = route.params.id
    const response = await axios.get('http://localhost:3000/posts/' + postId)
    product.value = response.data
  } catch (error) {
    errorFlag.value = true
    console.error('Error fetching data: ', error)
  }
}
onMounted(async () => {
  await loadProduct()
  const response = await axios.get('http://localhost:3000/users/session', {
    withCredentials: true,
  })
  userLogged.value = response.data.username
})

const editPost = () => {
  router.push({
    name: 'create-post',
    query: {
      id: product.value._id,
    },
  })
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

const buyNow = async () => {
  try {
    const postId = route.params.id;
    const response = await axios.post(`http://localhost:3000/posts/` + postId, { buyer: userLogged.value });
    product.value = response.data;
    await router.push({name: 'product page', params: {id: postId}}).then(() => {
      window.location.reload();
    });
  } catch (error) {
    errorFlag.value = true;
    console.error('Error buying product: ', error);
  }
}
</script>

<template>
  <div v-if="errorFlag">
    <h1>Product not found</h1>
  </div>
  <div v-else>
    <div v-if="product" class="product-page">
      <div class="product-image">
        <div v-for="(image, index) in product.images" :key="index">
          <img
            :src="'data:' + image.contentType + ';base64,' + image.data"
            alt="Post Image"
            class="post-image"
          />
        </div>
      </div>

      <div class="product-details">
        <h2>{{ product.title }}</h2>
        <p class="price">{{ product.price }}</p>

        <p
          :class="
            product.buyer === null || product.buyer === undefined
              ? 'available-status'
              : 'sold-status'
          "
        >
          {{
            product.buyer === null || product.buyer === undefined
              ? 'This item is available'
              : 'This item is not available'
          }}
        </p>

        <div class="actions">
          <div v-if="product.seller.username !== userLogged">
            <button
              :disabled="!(product.buyer === null || product.buyer === undefined)"
              @click="buyNow"
            >
              Buy Now
            </button>
            <button>Send a message to the seller</button>
          </div>
          <button @click="copyLink" class="copy-btn">
            {{ copied ? "Copied!" : "Share Link" }}
          </button>
        </div>

        <p>Product Description:</p>
        <p>{{ product.description }}</p>

        <div class="seller-info">
          <p>Seller:</p>
          <p>
            <a :href="`/profile/${product.seller.username}`">{{ product.seller.username }}</a>
          </p>
        </div>

        <button>Read Product Review</button>

        <div class="private-actions" v-if="product.seller.username === userLogged">
          <button v-if="true">Delete Post</button>
          <button v-if="true" @click="editPost">Edit Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  padding: 20px;
  margin: 0 auto;
}

.price {
  font-size: 1.5rem;
}
</style>
