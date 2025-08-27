<template>
  <div>Header</div>

  <ul>
    <li><Router-Link to="/">Home</Router-Link></li>
    <li v-if="!authStore.isAuth"><Router-Link to="/auth">auth</Router-Link></li>
    <li v-if="authStore.isAuth"><Router-Link to="/todos">todos</Router-Link></li>
    <li v-if="authStore.isAuth"><Router-Link to="/my-page">my-page</Router-Link></li>
    <li v-if="authStore.isAuth" @click="onLogout">logout</li>
  </ul>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/services/authApi';
import { toast } from '@/plugins/toast';

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

// ==================================================

const onLogout = async () => {
  appStore.show('로그아웃 중...');

  try {
    await authApi.deleteCurrentToken();
    authStore.removeToken();
    toast.warning('로그아웃이 완료되었습니다.');
    router.push({ name: 'home' });
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};
</script>
