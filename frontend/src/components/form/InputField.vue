<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  idField: {
    type: String,
    required: true
  },
  inputType: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});
</script>

<template>
  <div class="form-group">
    <label :for="idField">{{ idField }}</label>
    <input :type="inputType" :id="idField" v-model="inputValue" :placeholder="placeholder" />
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