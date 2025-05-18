<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const title = ref('')
const price = ref(null)
const condition = ref('new')
const description = ref('')
const seller = ref('')
const images = ref([])

const formTitle = computed(() => (route.query.id ? 'Edit a Post' : 'Create a Post'))

const loadProduct = async (id) => {
  try {
    const response = await axios.get(`/backend/posts/${id}`)
    const product = response.data
    title.value = product.title
    price.value = product.price
    condition.value = product.condition
    description.value = product.description
    images.value = product.images.map((image) => image.data)
  } catch (error) {
    console.error('Error fetching product data: ', error)
  }
}

const resetForm = () => {
  title.value = ''
  price.value = null
  condition.value = 'new'
  description.value = ''
  images.value = []
}

onMounted(async () => {
  const response = await axios.get('/backend/users/session', {
    withCredentials: true,
  })
  seller.value = response.data.username

  if (route.query.id) {
    await loadProduct(route.query.id)
  }
})

watch(
  () => route.query.id,
  async (id) => {
    id ? await loadProduct(id) : resetForm()
  },
)

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach((file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]
      images.value = [...images.value, base64String]
    }
  })
}

const moveImage = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < images.value.length) {
    const updatedImages = [...images.value]
    ;[updatedImages[index], updatedImages[newIndex]] = [
      updatedImages[newIndex],
      updatedImages[index],
    ]
    images.value = updatedImages
  }
}

const removeImage = (index) => {
  images.value = images.value.filter((_, i) => i !== index)
}

const handleSender = () => {
  axios
    .post(route.query.id ? `/backend/posts/${route.query.id}` : '/backend/posts', {
      title: title.value,
      price: price.value,
      condition: condition.value,
      description: description.value,
      sellerUsername: seller.value,
      images: images.value,
    })
    .then((response) => {
      console.log('Post created:', response.data)
      router.push({ name: 'product page', params: { id: response.data._id } })
    })
    .catch((error) => {
      console.error('Error during post creation:', error)
    })
}
</script>

<template>
  <div class="container">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="handleSender">
      <label>Title:</label>
      <input v-model="title" type="text" required />

      <label>Price:</label>
      <input v-model.number="price" type="number" step="0.01" required />

      <label>Condition:</label>
      <select v-model="condition" required>
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="refurbished">Refurbished</option>
      </select>

      <label>Description:</label>
      <textarea v-model="description" required></textarea>

      <label>Images:</label>
      <input type="file" multiple @change="handleImageUpload" accept="image/*" />

      <div v-if="images.length" class="image-preview">
        <div v-for="(image, index) in images" :key="index" class="image-item">
          <img :src="'data:image/jpeg;base64,' + image" alt="Uploaded image" />
          <button type="button" @click="moveImage(index, -1)" :disabled="index === 0">
            ️️
            <!--            ⬅️-->
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </button>
          <button
            type="button"
            @click="moveImage(index, 1)"
            :disabled="index === images.length - 1"
          >
            <!--            ➡️-->
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
          <button type="button" @click="removeImage(index)">
            <!--            ❌-->
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: var(--color-background-soft);
  border-radius: 8px;
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

input[type='file'] {
  margin-top: 10px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
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
  gap: 5px;
}

.image-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  margin-top: 10px;
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

  .image-item img {
    width: 80px;
    height: 80px;
  }

  button {
    font-size: 12px;
    padding: 8px 10px;
  }
}
</style>
