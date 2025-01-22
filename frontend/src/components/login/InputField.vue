<script setup>
defineProps({
  placeholder: {
    type: String,
    required: true
  },
  idField: {
    type: String,
    required: true
  },
  inputType: {
    type: String,
    required: true
  }
})


</script>

<template>
  <div class="form-group">
    <label :for="idField">{{ idField }}</label>
    <input :type="inputType" :id="idField" v-model="username" :placeholder="placeholder" />
  </div>
</template>

<style scoped>
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
</style>