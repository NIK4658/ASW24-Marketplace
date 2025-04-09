<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ShareButton from "@/components/ProductPageComponents/ShareButton.vue";
import BuyButton from "@/components/ProductPageComponents/BuyButton.vue";
import SendMessagesButton from "@/components/ProductPageComponents/SendMessagesButton.vue";
import ReviewSection from "@/components/ProductPageComponents/ReviewSection.vue";
import PrivateActionsProduct from "@/components/ProductPageComponents/PrivateActionsProduct.vue";

const route = useRoute()
const product = ref(null)
const errorFlag = ref(false)
const userLogged = ref('')
const currentImageIndex = ref(0)

const loadProduct = async () => {
  try {
    const response = await axios.get('/backend/posts/' + route.params.id)
    product.value = response.data
  } catch (error) {
    errorFlag.value = true
    console.error('Error fetching data: ', error)
  }
}

onMounted(async () => {
  await loadProduct()
  const response = await axios.get('/backend/users/session', {
    withCredentials: true,
  })
  userLogged.value = response.data.username
})

const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + product.value.images.length) % product.value.images.length
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length
}

</script>

<template>
  <div v-if="errorFlag" class="error-message">
    <h1>Product not found</h1>
  </div>
  <div v-else>
    <div v-if="product" class="product-page">
      <div
        :class="{
          'product-image-section': true,
          'center-content': product.images.length === 1,
        }"
      >
        <button v-if="product.images.length > 1" @click="prevImage" class="arrow left-arrow">
          &#10094;
        </button>
        <img
          :src="
            'data:' +
            product.images[currentImageIndex].contentType +
            ';base64,' +
            product.images[currentImageIndex].data
          "
          alt="Post Image"
          class="product-image"
        />
        <button v-if="product.images.length > 1" @click="nextImage" class="arrow right-arrow">
          &#10095;
        </button>
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
              ? 'This item is available' : product.buyer.username === userLogged ? 'You bought this item' :  'This item is not available'
          }}
        </p>

        <div class="actions">
          <BuyButton :product="product" :userLogged="userLogged"></BuyButton>
          <SendMessagesButton :product="product" :userLogged="userLogged"></SendMessagesButton>
          <ShareButton></ShareButton>
        </div>

        <p class="product-description-title">Product Description:</p>
        <p class="product-description">{{ product.description }}</p>

        <div class="seller-info">
          <p>Seller:</p>
          <p>
            <RouterLink :to="{ name: 'profile', params: { username: product.seller.username } }">
              {{ product.seller.username }}
            </RouterLink>
          </p>
        </div>

        <ReviewSection :product="product" :userLogged="userLogged"></ReviewSection>
        <PrivateActionsProduct :product="product" :userLogged="userLogged"></PrivateActionsProduct>

      </div>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px 20px;
  margin: 0 auto 100px;
  max-width: 800px;
  background-color: #fff;
}

.product-image-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.center-content {
  justify-content: center;
}

.product-image {
  max-width: 80%;
  border-radius: 12px;
  object-fit: fill;
  align-self: center;
}

.arrow {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}

.arrow:hover {
  color: #555;
}

.product-details {
  width: 100%;
  text-align: center;
}

.product-details h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.price {
  font-size: 2rem;
  color: #000;
  margin-bottom: 20px;
}

.price::before {
  content: '€';
}

.available-status {
  color: #4caf50;
  font-weight: bold;
  padding-bottom: 20px;
}

.sold-status {
  color: #f44336;
  font-weight: bold;
  padding-bottom: 20px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.product-description-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.product-description {
  margin-bottom: 20px;
}

.seller-info {
  margin-top: 20px;
}

.seller-info a {
  color: #2196f3;
  text-decoration: none;
}

.seller-info a:hover {
  text-decoration: underline;
}

</style>
