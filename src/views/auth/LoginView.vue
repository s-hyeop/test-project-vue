<template>
  <div>LoginView</div>
  <Form @submit="onSubmit" @invalid-submit="onInvalid">
    <div>
      <label for="email">이메일</label>
      <Field type="text" id="email" name="email" v-model="email" rules="rule-email" placeholder="email@example.com" autocomplete="off" readonly />
      <ErrorMessage name="email" />
    </div>
    <div>
      <label for="password">비밀번호</label>
      <Field type="password" id="password" name="password" v-model="password" placeholder="비밀번호를 입력해 주세요." autocomplete="off" />
      <ErrorMessage name="password" />
    </div>
    <button type="submit">로그인</button>
    <button @click="onResetPassword">비밀번호 찾기</button>
  </Form>

  <base-modal v-if="showModal" v-model="showModal" :btnConfirmText="'재설정'" :btnCancelText="'취소'" @confirm="onResetPasswordConfirm">
    <template #title>알림</template>
    <template #content>[{{ email }}]해당 계정의 비밀번호를 찾으시겠습니까?</template>
  </base-modal>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Form, Field, ErrorMessage, validate } from 'vee-validate';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/services/authApi';
import { toast } from '@/plugins/toast';
import BaseModal from '@/components/common/BaseModal.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

// ==================================================

const email = ref('');
const password = ref('');
const showModal = ref(false);

// ==================================================

const onSubmit = async () => {
  appStore.show('로그인 중...');

  try {
    const res = await authApi.login(email.value, password.value);
    authStore.setToken(res.data.token);
    toast.success('로그인 성공! 환영합니다!');
    router.push({ name: 'home' });
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};

const onInvalid = () => {
  toast.info('입력값을 확인해주세요.');
};

const onResetPassword = async () => (showModal.value = true);

const onResetPasswordConfirm = async () => {
  appStore.show('인증코드 전송 중...');
  try {
    await authApi.sendResetPasswordCode(email.value);
    toast.success(`인증코드가 ${email.value}로 전송되었습니다.`);
    router.push({ name: 'reset-password', query: { email: email.value } });
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};

// ==================================================

onBeforeMount(async () => {
  if (!route.query.email) {
    toast.warning('잘못된 접근입니다.');
    router.push({ name: 'email-check' });
  }

  const { valid } = await validate(route.query.email, 'rule-email');
  if (!valid) {
    toast.warning('잘못된 접근입니다.');
    router.push({ name: 'email-check' });
  }

  email.value = route.query.email;
});
</script>
