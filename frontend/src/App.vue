<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import io from 'socket.io-client'
import HeaderPage from '@/components/MainPageComponent/HeaderPage.vue'
import FooterPage from '@/components/MainPageComponent/FooterPage.vue'
import NotificationComponent from './components/ProductPageComponents/NotificationComponent.vue'

const socket = ref(null)
const popupRef = ref(null)
const route = useRoute()
const noHeaderFooterRoutesNames = ['signup', 'login']
const showHeaderFooter = computed(() => !noHeaderFooterRoutesNames.includes(route.name))

onMounted(() => {
  socket.value = io('http://localhost:3000', { withCredentials: true })

  socket.value.on('connect', () => {
    console.log('✅ Socket connesso')
  })

  socket.value.on('buyNotificationClient', () => {
    popupRef.value?.show('Hai ricevuto una notifica di acquisto!')
  })

  socket.value.on('newMessageNotificationClient', () => {
    popupRef.value?.show('Hai un nuovo messaggio!')
  })

  socket.value.on('reviewNotificationClient', () => {
    popupRef.value?.show('Hai ricevuto una recensione!')
  })
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
