<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import HeaderPage from '@/components/MainPageComponent/HeaderPage.vue'
import FooterPage from '@/components/MainPageComponent/FooterPage.vue'
import NotificationComponent from './components/ProductPageComponents/NotificationComponent.vue'
import { initialConnection, socket} from "@/socket.js";
import { popupRef } from '@/composables/usePopupRef'

const route = useRoute()
const noHeaderFooterRoutesNames = ['signup', 'login']
const showHeaderFooter = computed(() => !noHeaderFooterRoutesNames.includes(route.name))

onMounted(async () => {
  await initialConnection(popupRef)
})

onBeforeUnmount(() => {
  socket.value?.disconnect()
})

</script>

<template>
  <HeaderPage v-if="showHeaderFooter" />
  <main>
    <NotificationComponent ref="popupRef" />
    <RouterView />
  </main>
  <FooterPage v-if="showHeaderFooter" />
</template>

<style>
main{
  margin: 80px 0;
}
</style>
