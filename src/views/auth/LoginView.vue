<template>
  <div>LoginView</div>
  <div>
    <div>
      <label>이메일</label>
      <input type="email" :value="email" readonly />
    </div>
    <div>
      <label>비밀번호</label>
      <input type="password" v-model="password" />
    </div>
    <button @click="onLogin">로그인</button>
    <button @click="onResetPassword">비밀번호 찾기</button>
  </div>

  <base-modal v-model="isShow" :btnConfirmText="'재설정'" :btnCancelText="'취소'" @confirm="onConfirm">
    <template #title>알림</template>
    <template #content>[{{ email }}]해당 계정의 비밀번호를 찾으시겠습니까?</template>
  </base-modal>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/services/authApi';
import BaseModal from '@/components/common/BaseModal.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

// ==================================================

const email = ref('');
const password = ref('');
const isShow = ref(false);

// ==================================================

const onLogin = async () => {
  appStore.show('로그인 중...');

  try {
    const e = email.value;
    const p = password.value;
    const res = await authApi.login(e, p);
    authStore.setToken(res.data.token);
    router.push({ name: 'home' });
  } catch (e) {
    console.log(e.message);
  } finally {
    appStore.hidden();
  }
};

const onResetPassword = async () => (isShow.value = true);

const onConfirm = async () => {
  appStore.show('인증코드 전송 중...');
  try {
    await authApi.sendResetPasswordCode(email.value);
    router.push({ name: 'reset-password', query: { email: email.value } });
  } catch (e) {
    console.log(e.message); // TODO: TOAST
  } finally {
    appStore.hidden();
  }
};

// ==================================================

// 화면이 렌더링 되기 전에 확인 해야 함
onBeforeMount(() => {
  // TO-DO: Vaild(email[형태, 길이])
  if (!route.query.email) {
    router.push({ name: 'email-check' });
  } else {
    email.value = route.query.email;
  }
});
</script>
