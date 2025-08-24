<template>
  <div>Header</div>

  <ul>
    <li><Router-Link to="/">Home</Router-Link></li>
    <li v-if="!authStore.isAuth"><Router-Link to="/auth">auth</Router-Link></li>
    <li v-if="!authStore.isAuth"><Router-Link to="/login">login</Router-Link></li>
    <li v-if="!authStore.isAuth"><Router-Link to="/signup">signup</Router-Link></li>
    <li v-if="!authStore.isAuth"><Router-Link to="/reset-password">reset-password</Router-Link></li>
    <li v-if="authStore.isAuth"><Router-Link to="/todos">todos</Router-Link></li>
    <li v-if="authStore.isAuth"><Router-Link to="/my-page">my-page</Router-Link></li>
  </ul>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>
