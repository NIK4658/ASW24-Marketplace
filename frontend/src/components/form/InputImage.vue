<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  profileImage: {
    type: Object,
    default: null
  },
  profileImageUrl: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(['update:profileImage', 'update:profileImageUrl']);

const profileImage = ref(props.profileImage);
const profileImageUrl = ref(props.profileImageUrl);

function handleImageChange(event) {
  const file = event.target.files[0];
  profileImage.value = file;
  profileImageUrl.value = URL.createObjectURL(file);
  emit('update:profileImage', file);
  emit('update:profileImageUrl', profileImageUrl.value);
}
</script>

<template>
  <div class="form-group">
    <label :for="profileImage">{{ title }}</label>
    <input type="file" :id="profileImage" @change="handleImageChange" />
    <img v-if="profileImageUrl" :src="profileImageUrl" alt="Selected Profile Image" class="profile-image-preview" />
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

  .profile-image-preview {
  width: 100px; 
  height: auto;
  margin-top: 10px;
  }
</style>