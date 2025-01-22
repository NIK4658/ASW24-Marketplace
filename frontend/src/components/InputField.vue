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
  <h1>
    Loginasdasda
  </h1>
  <div class="form-group">
    <label :for="idField">{{ idField }}</label>
    <input :type="inputType" :id="idField" v-model="username" :placeholder="placeholder" />
  </div>
</template>

<style scoped>

</style>