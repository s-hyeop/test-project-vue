<template>
  <div>ResetPasswordView</div>
  <EmailCodeForm v-if="step === STEP_EMAIL_VERIFY" :email="email" :verifyType="'reset-password'" @complete="verifyComplete" />
  <ResetPasswordForm v-if="step === STEP_PROCESS" :email="email" :code="code" @complete="resetPasswordComplete" />
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EmailCodeForm from '@/components/forms/EmailCodeForm.vue';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm.vue';
const router = useRouter();
const route = useRoute();

const STEP_NOT_READY = 0;
const STEP_EMAIL_VERIFY = 1;
const STEP_PROCESS = 2;

const step = ref(STEP_NOT_READY);
const email = ref('');
const code = ref('');

const verifyComplete = (verifyCode) => {
  code.value = verifyCode;
  step.value = STEP_PROCESS;
};

const resetPasswordComplete = () => {
  router.push({ name: 'login', query: { email: email.value } });
};

onBeforeMount(() => {
  // TO-DO: 이메일 형식 검증
  if (!route.query.email) {
    router.push({ name: 'email-check' });
  } else {
    email.value = route.query.email;
    step.value = STEP_EMAIL_VERIFY;
  }
});
</script>
