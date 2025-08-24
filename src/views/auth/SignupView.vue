<template>
  <div>SignupView</div>
  <EmailCodeForm v-if="step === STEP_EMAIL_VERIFY" :email="email" :verifyType="'signup'" @complete="verifyComplete" />
  <SignupForm v-if="step === STEP_SIGNUP" :email="email" :code="code" @complete="signupComplete" />
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EmailCodeForm from '@/components/forms/EmailCodeForm.vue';
import SignupForm from '@/components/forms/SignupForm.vue';
const router = useRouter();
const route = useRoute();

const STEP_NOT_READY = 0;
const STEP_EMAIL_VERIFY = 1;
const STEP_SIGNUP = 2;

const step = ref(STEP_NOT_READY);
const email = ref('');
const code = ref('');

const verifyComplete = (verifyCode) => {
  code.value = verifyCode;
  step.value = STEP_SIGNUP;
};

const signupComplete = () => {
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
