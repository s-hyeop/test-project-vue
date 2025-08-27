<template>
  <div>HomeView</div>
  <router-link v-if="!authStore.isAuth" to="/auth">비회원 [바로가기]</router-link>
  <router-link v-if="authStore.isAuth" to="/todos">회원 [바로가기]</router-link>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>
