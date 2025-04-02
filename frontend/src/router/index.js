import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/ChatView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: () => import('@/views/CreatePost.vue'),
    },
    {
      path: '/post/:id',
      name: 'product page',
      component: () => import('@/views/ProductPageView.vue'),
    },
    {
      path: '/user/sales/:username',
      name: 'sales',
      component: () => import('@/views/SalesView.vue'),
    },
    {
      path: '/user/purchases/:username',
      name: 'purchases',
      component: () => import('@/views/PurchasesView.vue'),
    },
  ],
})

export default router
