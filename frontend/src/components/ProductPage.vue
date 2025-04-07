<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const review = ref(null)
const errorFlag = ref(false)
const userLogged = ref('')
let copied = ref(false)
const currentImageIndex = ref(0)

const loadProduct = async () => {
  try {
    const postId = route.params.id
    const response = await axios.get('/backend/posts/' + postId)
    product.value = response.data
  } catch (error) {
    errorFlag.value = true
    console.error('Error fetching data: ', error)
  }
  //console.log(product.value.buyer.username);
}

const loadReview = async () => {
  try {
    const postId = route.params.id
    const response = await axios.get('/backend/review/product/' + postId)
    console.log(response.data)
    if(response.data.length === 0) {
      review.value = null
    }
    else {
      review.value = response.data[0]
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      review.value = null
    } else {
      console.error('Error fetching review data: ', error)
    }
    console.error('Error fetching review data: ', error)
  }
}


onMounted(async () => {
  await loadProduct()
  await loadReview()
  const response = await axios.get('/backend/users/session', {
    withCredentials: true,
  })
  userLogged.value = response.data.username
  console.log(userLogged.value)
})

const editPost = () => {
  router.push({
    name: 'create-post',
    query: {
      id: product.value._id,
    },
  })
}

const createReview = () => {
  router.push({
    name: 'create-review',
    query: {
      id: product.value._id,
    },
  })
}

const deletePost = async () => {
  try {
    const postId = route.params.id
    const response = await axios.delete('/backend/posts/' + postId)
    product.value = response.data
    await router.push({ name: 'profile', params: { username: userLogged.value } }).then(() => {
      window.location.reload()
    })
  } catch (error) {
    errorFlag.value = true
    console.error('Error deleting the post: ', error)
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const buyNow = async () => {
  try {
    const postId = route.params.id
    const response = await axios.post(`/backend/posts/` + postId, {
      buyer: userLogged.value,
      status: 'sold',
    })
    product.value = response.data
    await router.push({ name: 'product page', params: { id: postId } }).then(() => {
      window.location.reload()
    })
  } catch (error) {
    errorFlag.value = true
    console.error('Error buying product: ', error)
  }
}

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
          <div class="buy-action" v-if="product.seller.username !== userLogged">
            <button
              :disabled="!(product.buyer === null || product.buyer === undefined)"
              @click="buyNow"
              :class="{
                'primary-btn': product.buyer === null || product.buyer === undefined,
                'disabled-btn': !(product.buyer === null || product.buyer === undefined),
              }"
            >
              Buy Now
            </button>
          </div>
          <button v-if="product.seller.username !== userLogged" class="secondary-btn">
            Send a message to the seller
          </button>
          <button @click="copyLink" class="secondary-btn">
            {{ copied ? 'Copied!' : 'Share Link' }}
          </button>
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
        <div class="review-section">
          <button :class="{
                'disabled-btn': product.buyer === null || product.buyer === undefined || review === null,
                'review-btn': !(product.buyer === null || product.buyer === undefined || review === null),
              }">Read Product Review</button>
          <button v-if="product.buyer !== null && product.buyer.username === userLogged" :class="{
                'disabled-btn': review !== null,
                'review-btn': review === null,
              }" @click="createReview">Write Product Review</button>
        </div>
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

.buy-action {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 0;
}

.primary-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #2196f3;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-btn:hover {
  background-color: #1976d2;
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

.private-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.review-section {
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

.review-btn {
  background-color: #eca200;
  padding: 10px 20px;
  font-size: 1rem;
  border: 1px solid #eca200;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.review-btn:hover {
  background-color: #fff;
  color: #eca200;
}
</style>
