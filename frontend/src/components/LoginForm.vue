<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/form/InputField.vue'
import SubmitButton from '@/components/form/SubmitButton.vue'
import {initialConnection} from '@/socket'
import { popupRef } from '@/composables/usePopupRef'


const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

function handleLogin() {
  axios
    .post(
      '/backend/users/session/login',
      {
        username: username.value,
        password: password.value,
      },
      { withCredentials: true }
    )
    .then((response) => {
      if (response.status !== 200) {
        errorMessage.value = response.data.message
      } else {
        initialConnection(popupRef)
        router.push({ name: 'home' })
      }
    })
    .catch((error) => {
      console.error('Error during login:', error)
      errorMessage.value = error.response.data.message
    })
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input-field
        v-model="username"
        placeholder="Enter your username"
        idField="Username"
        inputType="text"
      />
      <input-field
        v-model="password"
        placeholder="Enter your password"
        idField="Password"
        inputType="password"
      />
      <submit-button class="submit" textField="Log In" buttonType="submit" />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <hr class="divider" />
    </form>
    <div class="signup-container">
      <p>Don't have an account?</p>
      <submit-button
        textField="Sign Up"
        buttonType="submit"
        @click="router.push({ name: 'signup' })"
      />
    </div>
  </div>
</template>

<style scoped>
.login-container {
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

.signup-container p {
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

.submit {
  margin-top: 10px;
}
</style>
