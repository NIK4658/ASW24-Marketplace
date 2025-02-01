<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderPage from '@/components/MainPageComponent/HeaderPage.vue'
import FooterPage from '@/components/MainPageComponent/FooterPage.vue'

const route = useRoute()
const noHeaderFooterRoutes = ['/signup', '/login']

const showHeaderFooter = computed(() => !noHeaderFooterRoutes.includes(route.path))
</script>

<template>
  <HeaderPage v-if="showHeaderFooter" />
  <main>
    <RouterView />
  </main>
  <FooterPage v-if="showHeaderFooter" />
</template>

<style></style>
