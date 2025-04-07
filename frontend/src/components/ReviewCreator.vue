<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@fortawesome/fontawesome-free/css/all.css'
import axios from 'axios'

const submitted = ref(false)  // Flag per sapere se il form è stato inviato
const router = useRouter()
const route = useRoute()
const title = ref('')
const price = ref(null)
const condition = ref('new')
const description = ref('')
const seller = ref(null)
const buyer = ref('')
const images = ref([])
const review = ref(null)

const loadProduct = async (id) => {
  try {
    const response = await axios.get(`/backend/posts/${id}`)
    const product = response.data

    try{
      const responseReview = await axios.get(`/backend/review/product/${id}`)
      review.value = responseReview.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        review.value = null
      }
      console.error('Error fetching review data: ', error)
    }

    if (product.buyer === null || review.value !== null) {
      router.push({ name: 'product page', params: { id } })
    }

    title.value = product.title
    price.value = product.price
    condition.value = product.condition
    description.value = product.description
    buyer.value = product.buyer
    images.value = product.images.map((image) => image.data)
    seller.value = product.seller

  } catch (error) {
    console.error('Error fetching product data: ', error)
  }
}

const resetForm = () => {
  score.value = 0
  reviewTitle.value = ''
  reviewDescription.value = ''
}

onMounted(async () => {
  const response = await axios.get('/backend/users/session', {
    withCredentials: true,
  })
  response.data
    ? (buyer.value = response.data.username)
    : (buyer.value = null)
  await loadProduct(route.query.id)
})

watch(() => route.query.id, async (id) => {
  id ? await loadProduct(id) : resetForm()
})

const handleSender = () => {
  submitted.value = true
  console.log(buyer.value)
  console.log(seller.value)
  console.log(route.query.id)
  console.log(score.value)
  console.log(reviewTitle.value)
  console.log(reviewDescription.value)

  if (isValidForm.value) {
    axios
      .post('/backend/review',
        {
          buyer: buyer.value,
          seller: seller.value,
          post: route.query.id,
          score: score.value,
          title: reviewTitle.value,
          description: reviewDescription.value,
        },
        {
          withCredentials: true, // Aggiungi questa opzione per inviare i cookie di sessione
        }
      )
      .then((response) => {
        console.log('Review created:', response.data)
        router.push({name: 'product page', params: {id: response.data._id}})
      })
      .catch((error) => {
        console.error('Error during review creation:', error)
      })
  }
}

const maxScore = 5
const score = ref(0)
const hoverValue = ref(null)
const reviewTitle = ref('')
const reviewDescription = ref('')

const isValidForm = computed(() => {
  return score.value && reviewTitle.value && reviewDescription.value
})


</script>

<template>
  <div class="container">
    <h2> Post a review about: {{title}} </h2>
    <h3> Seller:  </h3>
    <h3> Condition: {{condition}} </h3>
    <h3> paid: €{{price}} </h3>
    <form @submit.prevent="handleSender">
      <!-- Rating -->
      <label>Rating:</label>
      <div class="star-rating">
        <i
          v-for="n in maxScore"
          :key="n"
          class="fa-star"
          :class="{
            fas: n <= (hoverValue ?? score),
            far: n > (hoverValue ?? score),
            filled: n <= (hoverValue ?? score)
          }"
          @mouseover="hoverValue = n"
          @mouseleave="hoverValue = null"
          @click="score = n"
        />
      </div>
      <!-- Condizione per obbligare la selezione -->
      <span v-if="submitted && !score" style="color: red;">Rating is required.</span>

      <!-- Review Title -->
      <label>Review Title:</label>
      <input type="text" v-model="reviewTitle" required />
      <span v-if="submitted && !reviewTitle" style="color: red;">Title is required.</span>

      <!-- Review Description -->
      <label>Review Description:</label>
      <textarea v-model="reviewDescription" required></textarea>
      <span v-if="submitted && !reviewDescription" style="color: red;">Description is required.</span>

      <!-- Submit Button -->
      <!-- <button type="submit" :disabled="!isValidForm">Submit</button> -->
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.container {
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-top: 10px;
}

.star-rating {
  display: flex;
  gap: 4px;
  font-size: 2rem;
  cursor: pointer;
}

i {
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}

.filled {
  color: gold;
}

</style>

