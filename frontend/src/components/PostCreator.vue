<script setup>
import { ref, onMounted, computed } from 'vue'
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
    const response = await axios.get(`http://localhost:3000/posts/${id}`)
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

onMounted(async () => {
  const response = await axios.get('http://localhost:3000/users/session', {
    withCredentials: true,
  })
  seller.value = response.data.username

  if (route.query.id) {
    await loadProduct(route.query.id)
  }
})

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
    .post(
      route.query.id
        ? `http://localhost:3000/posts/${route.query.id}`
        : 'http://localhost:3000/posts',
      {
        title: title.value,
        price: price.value,
        condition: condition.value,
        description: description.value,
        sellerUsername: seller.value,
        images: images.value,
      },
    )
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
    <h2>{{ formTitle}}</h2>
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
          <button type="button" @click="moveImage(index, -1)" :disabled="index === 0">️️⬅️</button>
          <button
            type="button"
            @click="moveImage(index, 1)"
            :disabled="index === images.length - 1"
          >
            ➡️
          </button>
          <button type="button" @click="removeImage(index)">❌</button>
        </div>
      </div>

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
</style>
