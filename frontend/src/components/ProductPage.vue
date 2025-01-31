<script setup>
import axios from "axios";
import {ref, onMounted} from "vue";
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);
const loadProduct = async () => {
  try {
    const postId = route.query.id;
    const response = await axios.get('http://localhost:3000/posts/' + postId)
    product.value = response.data
    console.log(product.value)
  } catch (error) {
    console.error('Error fetching data: `', error)
  }
}
onMounted(() => {
  loadProduct()
})
</script>

<script>
export default {
  methods: {
    buyNow() {
      /*TODO*/
    },
    contactSeller() {
      /*TODO*/
    },
    shareProduct() {
      /*TODO*/
    },
    deletePost() {
      /*TODO*/
    },
    editPost() {
      /*TODO*/
    },
    readReviews() {
      /*TODO*/
    }
  }
};
</script>

<template>
  <div v-if="product" class="product-page">
    <div class="product-image">
      <div v-for="(image, index) in product.images" :key="index">
        <img :src="'data:' + image.contentType + ';base64,' + image.data" alt="Post Image" class="post-image" />
      </div>
    </div>

    <div class="product-details">
      <h2>{{ product.title }}</h2>
      <p class="price">{{product.price}}</p>

      <p :class="(product.buyer === null || product.buyer === undefined)  ? 'available-status': 'sold-status' ">
        {{ (product.buyer === null || product.buyer === undefined) ? 'This item is available' : 'This item is not available' }}
      </p>

      <div class="actions">
        <button :disabled="!(product.buyer === null || product.buyer === undefined)" @click="buyNow">Buy Now</button>
        <button @click="contactSeller">Send a message to the seller</button>
        <button @click="shareProduct">Share Link</button>
      </div>

      <p>Product Description:</p>
      <p>{{ product.description }}</p>

      <div class="seller-info">
        <p>Seller:</p>
        <p><a :href="`users/${product.seller._id}`">{{ product.seller.username }}</a></p>
      </div>

      <button @click="readReviews">Read Product Review</button>

      <div class="private-actions">
        <button v-if="true" @click="deletePost">Delete Post</button>
        <button v-if="true" @click="editPost">Edit Post</button>
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

.sold-status {
  color: red;
}
</style>
