<script setup>
import axios from 'axios'
import { ref } from 'vue'
import ImputField from '@/components/InputField.vue'

const username = ref('')
const password = ref('')

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
			<input-field placeholder="Enter your username" idField="Username" inputType="text" />
			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					v-model="password"
					placeholder="Enter your password"
				/>
			</div>
			<button type="submit">Login</button>
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

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	input {
		width: 100%;
		padding: 8px;
		box-sizing: border-box;
	}

	button {
		padding: 10px 15px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}

	.error-message {
		color: red;
		margin-top: 15px;
	}
</style>
