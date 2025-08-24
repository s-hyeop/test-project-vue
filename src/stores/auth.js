import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null);

  const isAuth = computed(() => !!accessToken.value);

  const setToken = (token) => {
    accessToken.value = token;
  };

  const removeToken = () => {
    accessToken.value = null;
  };

  return {
    accessToken,
    isAuth,
  };
});
