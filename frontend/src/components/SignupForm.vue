<script setup>
import axios from 'axios'
import { ref } from 'vue'
import InputField from '@/components/form/InputField.vue'
import SubmitButton from '@/components/form/SubmitButton.vue'

const username = ref('');
const password = ref('');
const email = ref('');
const profileImage = ref(null);
const profileImageUrl = ref(null);
const errorMessage = ref('');

function handleSignup() {
  axios.post('http://localhost:3000/users/', {
    username: username.value,
    password: password.value
  })
  .then(response => {
    localStorage.setItem('token', response.data.access)
    localStorage.setItem('refreshToken', response.data.refresh)
  })
  .catch(error => {
    console.error(error)
  })
}

function handleImageChange(event) {
  const file = event.target.files[0];
  profileImage.value = file;
  profileImageUrl.value = URL.createObjectURL(file);
}
</script>

<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <p>Fill in the form below to create an account</p>
    <form @submit.prevent="handleSignup">
      <input-field v-model="username" placeholder="Enter your new username" idField="Username" inputType="text"/>
      <input-field v-model="password" placeholder="Enter your new password" idField="Password" inputType="password"/>
      <input-field v-model="email" placeholder="user@mail.com" idField="Email" inputType="text"/>
      
      TODO: Add the InputImage component here
      <div class="form-group">
        <label for="profileImage">Profile Image</label>
        <input type="file" id="profileImage" @change="handleImageChange" />
        <img v-if="profileImageUrl" :src="profileImageUrl" alt="Selected Profile Image" class="profile-image-preview" />
      </div>

      <submit-button textField="Sign Up" buttonType="submit"/>
      <hr class="divider" />
      <div class="login-container">
        <p>Already signed up?</p>
        <submit-button textField="Log In" buttonType="submit"/>
      </div>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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

	.form-group {
		margin-bottom: 15px;
	}

  .profile-image-preview {
  width: 100px; /* Adjust the size as needed */
  height: auto;
  margin-top: 10px; /* Add some space above the image */
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