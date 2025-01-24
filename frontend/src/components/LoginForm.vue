<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import InputField from '@/components/form/InputField.vue'
import SubmitButton from '@/components/form/SubmitButton.vue'

const router = useRouter();

const username = ref('')
const password = ref('')
const errorMessage = ref('')

function handleLogin() {
	axios.post("http://localhost:3000/users/login/", {
		params: {
			username: username.value,
			password: password.value
		}
	})
		.then(response => {
			console.log("A")
			if (response.status !== 200) {
				errorMessage.value = response.data.message;
			} else {
				// TODO: Set session token
				router.push({ name: 'home' });
			}
		}).catch(error => {
			console.error("Error during login:", error);
			errorMessage.value = error.response.data.message;
		});
}

function navigateToSignup() {
	router.push({ name: 'signup' });
}
</script>
<template>
	<div class="login-container">
		<h1>Login</h1>
		<form @submit.prevent="handleLogin">
			<input-field v-model="username" placeholder="Enter your username" idField="Username" inputType="text" />
			<input-field v-model="password" placeholder="Enter your password" idField="Password" inputType="password" />
			<submit-button textField="Log In" buttonType="submit" />
			<p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
			<hr class="divider" />
			<div class="signup-container">
				<p>Don't have an account?</p>
				<submit-button textField="Sign Up" buttonType="submit" @click="navigateToSignup" />
			</div>
		</form>
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
