<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const { product, userLogged } = defineProps({
  product: Object,
  userLogged: String,
});

const review = ref(null)
const userReview = ref('')
const route = useRoute();
const router = useRouter();

const loadReview = async () => {
  try {
    const response = await axios.get('/backend/review/product/' + route.params.id)
    if(response.data.length !== 0) {
      review.value = response.data[0]
      const responseUserReview = await axios.get('/backend/users/id/' + review.value.buyer)
      userReview.value = responseUserReview.data
    }
    else {
      review.value = null
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      review.value = null
    } else {
      console.error('Error fetching review data: ', error)
    }
  }
}

onMounted(async () => {
  await loadReview()
})


const createReview = () => {
  router.push({
    name: 'create-review',
    query: {
      id: product._id,
    },
  })
}

</script>

<template>
  <div class="review-section">
    <div v-if="review !== null">
      <p>Product Review:</p>
      <p>{{ review.title }}</p>
      <p>{{ review.description }}</p>
      <p>Rating: {{ review.score }}/5</p>
      <p>Review by: {{ userReview.username }}</p>
    </div>
    <div v-if="review === null">
      <p>No review available for this product.</p>
    </div>
    <button v-if="product.buyer !== null && product.buyer.username === userLogged" :class="{
                'disabled-btn': review !== null,
                'review-btn': review === null,
              }" @click="createReview">Write Product Review
    </button>
  </div>
</template>

<style scoped>

.review-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
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

.disabled-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
