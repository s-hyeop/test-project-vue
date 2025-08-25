import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import Cookies from 'js-cookie';

const KEY = 'access_token';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(Cookies.get(KEY) || null);
  const isAuth = computed(() => !!accessToken.value);

  watch(
    accessToken,
    (value) => {
      if (value) {
        Cookies.set(KEY, value, {
          expires: 7,
          sameSite: 'Strict',
          path: '/',
        });
      } else {
        Cookies.remove(KEY, { path: '/' });
      }
    },
    { immediate: true },
  );

  const setToken = (token) => {
    accessToken.value = token;
  };
  const removeToken = () => {
    accessToken.value = null;
  };

  return {
    accessToken,
    isAuth,
    setToken,
    removeToken,
  };
});
