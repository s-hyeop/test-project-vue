<template>
  <div>ResetPasswordView</div>
  <EmailCodeForm v-if="step === STEP_EMAIL_VERIFY" :email="email" :verifyType="'reset-password'" @complete="verifyComplete" />

  <div v-show="step === STEP_PROCESS">
    <div>
      <label>이메일</label>
      <input type="email" :value="email" readonly />
    </div>
    <div>
      <label>비밀번호</label>
      <input type="password" v-model="password" />
    </div>
    <div>
      <label>비밀번호 확인</label>
      <input type="password" v-model="confirmPassword" />
    </div>
    <button @click="onResetPasswordClick">비밀번호 초기화</button>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authApi } from '@/services/authApi';
import EmailCodeForm from '@/components/common/EmailCodeForm.vue';

const STEP_NOT_READY = 0;
const STEP_EMAIL_VERIFY = 1;
const STEP_PROCESS = 2;
const router = useRouter();
const route = useRoute();

// ==================================================

const step = ref(STEP_NOT_READY);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const code = ref('');

// ==================================================

const verifyComplete = (verifyCode) => {
  code.value = verifyCode;
  step.value = STEP_PROCESS;
};

const onResetPasswordClick = async () => {
  appStore.show('비밀번호 재설정 중...');

  try {
    // TO-DO: Vaild(비밀번호 규격[규격, 길이])
    if (password.value != confirmPassword.value) {
      console.log('비밀번호가 일치하지 않음');
      return;
    }

    const e = email.value;
    const p = password.value;
    const c = code.value;
    await authApi.resetPassword(e, p, c);
    router.push({ name: 'login', query: { email: email.value } });
  } catch (error) {
    console.log(error.message);
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
    step.value = STEP_EMAIL_VERIFY;
  }
});
</script>
