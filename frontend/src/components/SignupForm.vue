<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/form/InputField.vue'
import InputImage from '@/components/form/InputImage.vue'
import SubmitButton from '@/components/form/SubmitButton.vue'

const router = useRouter()

const username = ref('')
const password = ref('')
const email = ref('')
const profileImage = ref(null)
const profileImageUrl = ref(null)
const errorMessage = ref('')

function handleSignup() {
  axios
    .post('http://localhost:3000/users/', {
      username: username.value,
      email: email.value,
      password: password.value,
      image: profileImage.value,
    })
    .then((response) => {
      if (response.status !== 200) {
        errorMessage.value = response.data.message
      } else {
        router.push({ name: 'login' })
      }
    })
    .catch((error) => {
      console.error('Error during sign up:', error)
      errorMessage.value = error.response.data.message
    })
}

function handleImageChange(event) {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onloadend = () => {
    profileImage.value = reader.result.split(',')[1] // Get base64 string
    profileImageUrl.value = URL.createObjectURL(file)
  }
  reader.readAsDataURL(file)
}

function navigateToLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup">
      <input-field
        v-model="username"
        placeholder="Enter your new username"
        idField="Username"
        inputType="text"
      />
      <input-field
        v-model="password"
        placeholder="Enter your new password"
        idField="Password"
        inputType="password"
      />
      <input-field v-model="email" placeholder="user@mail.com" idField="Email" inputType="text" />
      <input-image
        title="Profile Image (Optional)"
        :profileImage="profileImage"
        :profileImageUrl="profileImageUrl"
        @change="handleImageChange"
      />
      <submit-button textField="Sign Up" buttonType="submit" />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <hr class="divider" />
      <div class="login-container">
        <p>Already signed up?</p>
        <submit-button textField="Log In" buttonType="submit" @click="navigateToLogin" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-container {
  max-width: 400px;
  margin: 10px auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-container p {
  margin-bottom: 10px;
}

.error-message {
  color: red;
  margin-top: 15px;
}

.divider {
  margin: 20px 0;
  width: 100%;
}
</style>
