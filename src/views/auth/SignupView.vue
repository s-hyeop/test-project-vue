<template>
  <div>SignupView</div>
  <EmailCodeForm v-if="step === STEP_EMAIL_VERIFY" :email="email" :verifyType="'signup'" @complete="verifyComplete" />

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
    <div>
      <label>사용자 이름</label>
      <input type="text" v-model="userName" />
    </div>
    <button @click="onSignupClick">회원가입</button>
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
const userName = ref('');
const code = ref('');

// ==================================================

const verifyComplete = (verifyCode) => {
  code.value = verifyCode;
  step.value = STEP_PROCESS;
};

const onSignupClick = async () => {
  appStore.show('회원가입 중...');

  try {
    // TO-DO: Vaild(닉네임[규격, 길이], 비밀번호 규격[규격, 길이])
    if (password.value != confirmPassword.value) {
      console.log('비밀번호가 일치하지 않음');
      return;
    }

    const e = props.email;
    const p = password.value;
    const u = userName.value;
    const c = props.code;
    await authApi.signup(e, p, u, c);
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
  // TO-DO: 이메일 형식 검증 (VALID, TOAST)
  if (!route.query.email) {
    router.push({ name: 'email-check' });
  } else {
    email.value = route.query.email;
    step.value = STEP_EMAIL_VERIFY;
  }
});
</script>
