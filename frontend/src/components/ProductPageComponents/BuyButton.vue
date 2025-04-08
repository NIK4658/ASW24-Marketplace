<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const { product, userLogged } = defineProps({
  product: Object,
  userLogged: String,
});

const route = useRoute();
const router = useRouter();

const buyNow = async () => {
  try {
    await axios.post(`/backend/posts/${route.params.id}`, {
      buyer: userLogged,
      status: 'sold',
    });
    await router.push({ name: 'product page', params: { id: route.params.id } });
    window.location.reload();
  } catch (error) {
    console.error('Errore durante l\'acquisto: ', error);
  }
};
</script>

<template>
    <div
      class="buy-action"
      v-if="product && product.seller && product.seller.username !== userLogged">
      <button
        :disabled="product.buyer !== null && product.buyer !== undefined"
        @click="buyNow"
        :class="{
          'primary-btn': product.buyer === null || product.buyer === undefined,
          'disabled-btn': product.buyer !== null && product.buyer !== undefined,
        }">
        Buy Now
      </button>
    </div>
</template>

<style scoped>
.buy-action {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 0;
}

.primary-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #2196f3;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-btn:hover {
  background-color: #1976d2;
}

.disabled-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
