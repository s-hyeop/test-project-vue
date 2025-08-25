<template>
  <div>SignupView</div>
  <EmailCodeForm v-if="step === STEP_EMAIL_VERIFY" :email="email" :verifyType="'signup'" @complete="verifyComplete" />
  <SignupForm v-if="step === STEP_PROCESS" :email="email" :code="code" @complete="signupComplete" />
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EmailCodeForm from '@/components/forms/EmailCodeForm.vue';
import SignupForm from '@/components/forms/SignupForm.vue';

const STEP_NOT_READY = 0;
const STEP_EMAIL_VERIFY = 1;
const STEP_PROCESS = 2;
const router = useRouter();
const route = useRoute();

// ==================================================

const step = ref(STEP_NOT_READY);
const email = ref('');
const code = ref('');

// ==================================================

const verifyComplete = (verifyCode) => {
  code.value = verifyCode;
  step.value = STEP_PROCESS;
};

const signupComplete = () => {
  router.push({ name: 'login', query: { email: email.value } });
};

// ==================================================

// 화면이 렌더링 되기 전에 확인 해야 함
onBeforeMount(() => {
  // TO-DO: 이메일 형식 검증 (VALID, TOAST)
  if (!route.query.email) {
    router.push({ name: 'email-check' });
  } else {
    email.value = route.query.email;
    step.value = STEP_EMAIL_VERIFY;
  }
});
</script>
