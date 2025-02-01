<script setup>
import { useRoute } from 'vue-router'
import HeaderPage from '@/components/MainPageComponent/HeaderPage.vue'
import FooterPage from '@/components/MainPageComponent/FooterPage.vue'

const route = useRoute()
const noHeaderFooterRoutes = ['/signup', '/login']

const showHeaderFooter = !noHeaderFooterRoutes.includes(route.path)
</script>

<template>
  <div>
    <HeaderPage v-if="showHeaderFooter" />
    <main>
      <RouterView />
    </main>
    <FooterPage v-if="showHeaderFooter" />
  </div>
</template>

<style></style>
