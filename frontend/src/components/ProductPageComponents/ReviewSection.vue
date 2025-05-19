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
    const response = await axios.get('http://localhost:3000/review/product/' + route.params.id)
    if(response.data.length !== 0) {
      review.value = response.data[0]
      const responseUserReview = await axios.get('http://localhost:3000/users/id/' + review.value.buyer)
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
      <h2 class="section-title">Product Review:</h2>
      <div class="writtenReview-section">
      <p class="review-rating">⭐ {{ review.score }}/5</p>
      <h3 class="review-title">{{ review.title }}</h3>
      <p class="review-description">"{{ review.description }}"</p>
      <p class="review-author">Reviewed by: <strong>{{ userReview.username }}</strong></p>
      </div>
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

.writtenReview-section{
  border: 1px solid #ccc;
  border-radius: 5px;
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

.section-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
  font-weight: 700;
}

.review-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2c3e50;
}

.review-description {
  font-size: 1rem;
  color: #444;
  margin-bottom: 12px;
  line-height: 1.5;
}

.review-rating {
  font-weight: 500;
  color: #f39c12;
  margin-bottom: 8px;
  font-size: 1.2rem;
}

.review-author {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 10px;
  font-style: italic;
}


</style>
