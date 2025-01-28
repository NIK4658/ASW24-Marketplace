<script setup>
const props = defineProps({
  textField: {
    type: String,
    required: true
  },
  buttonType: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['submit']);

function handleClick() {
  emit('submit');
}
</script>

<template>
  <button :type="props.buttonType" @click="handleClick">{{ props.textField }}</button>
</template>

<style scoped>
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
</style>
