<template>
  <div>EmailCheckView</div>
  <input type="email" v-model="email" />
  <button type="button" @click="checkEmail" :disabled="loading">
    {{ loading ? '확인 중...' : '다음으로' }}
  </button>

  <base-modal
    v-model="isShow"
    :btnConfirmText="'회원가입'"
    :btnCancelText="'취소'"
    @confirm="onConfirm"
  >
    <template #title>알림</template>
    <template #content>[{{ email }}]해당 계정으로 회원가입을 하시겠습니까?</template>
  </base-modal>
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router';
import { authApi } from '@/services/authApi';
import BaseModal from '@/components/common/BaseModal.vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const email = ref(null);
const loading = ref(false);
const isShow = ref(false);

const checkEmail = async () => {
  loading.value = true;

  try {
    if (!email.value) {
      console.log('이메일을 입력해주세요.'); // TO-DO: VALID, TOAST
      return;
    }

    const res = await authApi.checkEmailExist(email.value);
    if (res.data.exists) {
      router.push({ name: 'login', query: { email: email.value } });
    } else {
      // showModal
      isShow.value = true;
    }
  } catch (e) {
    console.log(e.message); // TO-DO: TOAST
  } finally {
    loading.value = false;
  }
};

const onConfirm = async () => {
  appStore.show('인증코드 전송 중...');
  try {
    await authApi.sendSignupCode(email.value);
    router.push({ name: 'signup', query: { email: email.value } });
  } catch (error) {
    console.log('error.message'); // TODO: TOAST
  } finally {
    appStore.hidden();
  }
};
</script>
