<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderPage from '@/components/MainPageComponent/HeaderPage.vue'
import FooterPage from '@/components/MainPageComponent/FooterPage.vue'

const route = useRoute()
const noHeaderFooterRoutesNames = ['signup', 'login']

const showHeaderFooter = computed(() => !noHeaderFooterRoutesNames.includes(route.name))
</script>

<template>
  <HeaderPage v-if="showHeaderFooter" />
  <main>
    <RouterView />
  </main>
  <FooterPage v-if="showHeaderFooter" />
</template>

<style></style>
