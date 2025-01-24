<script setup>
import axios from 'axios'
import { ref } from 'vue'
import InputField from '@/components/form/InputField.vue'
import SubmitButton from '@/components/form/SubmitButton.vue'

const username = ref('')
const password = ref('')
const errorMessage = ref('')

function handleLogin() {
	axios.get('http://localhost:3000/users/', {
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
</script>

<template>
	<div class="login-container">
		<h1>Login</h1>
		<form @submit.prevent="handleLogin">
			<input-field v-model="username" placeholder="Enter your username" idField="Username" inputType="text"/>
			<input-field v-model="password" placeholder="Enter your password" idField="Password" inputType="password"/>
			<submit-button textField="Log In" buttonType="submit"/>
			<hr class="divider" />
			<div class="signup-container">
				<p>Don't have an account?</p>
				<submit-button textField="Sign Up" buttonType="submit"/>
			</div>
		</form>
		<p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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

	.form-group {
		margin-bottom: 15px;
	}

	.register-container {
		max-width: 400px;
		margin: 10px auto;
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
</style>
