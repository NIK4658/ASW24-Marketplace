<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { socket } from '@/socket.js'

const submitted = ref(false) // Flag per sapere se il form è stato inviato
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
    const response = await axios.get(`http://localhost:3000/posts/${id}`)
    const product = response.data

    try {
      const responseReview = await axios.get(`http://localhost:3000/review/product/${id}`)
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
  const response = await axios.get('http://localhost:3000/users/session', {
    withCredentials: true,
  })
  response.data ? (buyer.value = response.data.username) : (buyer.value = null)
  await loadProduct(route.query.id)
})

watch(
  () => route.query.id,
  async (id) => {
    id ? await loadProduct(id) : resetForm()
  },
)

const handleSender = () => {
  submitted.value = true
  if (isValidForm.value) {
    axios
      .post(
        'http://localhost:3000/review',
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
        },
      )
      .then((response) => {
        socket.value.emit('reviewNotificationServer', {
          targetUser: seller.value.username,
        })
        console.log('Review created:', response.data)
        router.push({ name: 'product page', params: { id: response.data.post } })
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
    <h2>Post a review about: {{ title }}</h2>
    <h3>Seller: {{ seller.username }}</h3>
    <h3>Condition: {{ condition }}</h3>
    <h3>paid: €{{ price }}</h3>
    <form @submit.prevent="handleSender">
      <!-- Rating -->
      <label>Rating:</label>
      <div
        class="star-rating"
      >
        <font-awesome-icon
          @click = "score = n"
          @mouseover = "hoverValue = n"
          @mouseleave = "hoverValue = null"
          v-for="n in maxScore"
          :key="n"
          :icon="['fas', n <= (hoverValue ?? score) ? 'star' : 'star']"
          :data-value="n"
          :class="{ filled: n <= (hoverValue ?? score) }"
        />
      </div>
      <!-- Condizione per obbligare la selezione -->
      <span v-if="submitted && !score" style="color: red">Rating is required.</span>

      <!-- Review Title -->
      <label>Review Title:</label>
      <input type="text" v-model="reviewTitle" required />

      <!-- Review Description -->
      <label>Review Description:</label>
      <textarea v-model="reviewDescription" required></textarea>

      <!-- Submit Button -->
      <!-- <button type="submit" :disabled="!isValidForm">Submit</button> -->
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.star-rating {
  display: flex;
  gap: 4px;
  font-size: 2rem;
}

.filled {
  color: gold;
}

.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: var(--color-text);
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-weight: bold;
  color: var(--color-text);
}

input[type='text'],
input[type='number'],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  h2 {
    font-size: 18px;
  }

  form {
    gap: 10px;
  }

  input[type='text'],
  input[type='number'],
  textarea,
  select {
    font-size: 12px;
  }

  button {
    font-size: 12px;
    padding: 8px 10px;
  }
}
</style>
