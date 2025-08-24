import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const loading = ref(false);
  const message = ref('');

  const show = (msg = '처리 중...') => {
    loading.value = true;
    message.value = msg;
  };

  const hidden = () => {
    loading.value = false;
    message.value = '';
  };

  return {
    loading,
    message,
    show,
    hidden,
  };
});
