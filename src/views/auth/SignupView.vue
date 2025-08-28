<template>
  <div>SignupView</div>
  <EmailCodeCheck v-if="step === STEP_EMAIL_VERIFY" :email="email" :verifyType="'signup'" @complete="onVerifyComplete">
    <template #title>
      <div>제목</div>
    </template>
  </EmailCodeCheck>

  <div v-show="step === STEP_PROCESS">
    <Form @submit="onSubmit" @invalid-submit="onInvalid">
      <div>
        <label for="email">이메일</label>
        <Field type="text" id="email" name="email" v-model="email" rules="rule-email" placeholder="email@example.com" autocomplete="off" readonly />
        <ErrorMessage name="email" />
      </div>
      <div>
        <label for="password">비밀번호</label>
        <Field type="password" id="password" name="password" v-model="password" rules="rule-password" placeholder="비밀번호를 입력해 주세요." autocomplete="off" />
        <ErrorMessage name="password" />
      </div>
      <div>
        <label for="confirmPassword">비밀번호 확인</label>
        <Field type="password" id="confirmPassword" name="confirmPassword" v-model="confirmPassword" rules="rule-confirmPassword:password" placeholder="비밀번호를 다시 입력해 주세요." autocomplete="off" />
        <ErrorMessage name="confirmPassword" />
      </div>
      <div>
        <label for="userName">이름</label>
        <Field type="text" id="userName" name="userName" v-model="userName" rules="rule-username" placeholder="이름을 입력해 주세요." autocomplete="off" />
        <ErrorMessage name="userName" />
      </div>
      <button type="submit">회원가입</button>
    </Form>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Form, Field, ErrorMessage, validate } from 'vee-validate';
import { useAppStore } from '@/stores/app';
import { authApi } from '@/services/authApi';
import { toast } from '@/plugins/toast';
import EmailCodeCheck from '@/components/common/EmailCodeCheck.vue';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

// ==================================================

const STEP_NOT_READY = 0;
const STEP_EMAIL_VERIFY = 1;
const STEP_PROCESS = 2;

const step = ref(STEP_NOT_READY);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const userName = ref('');
const code = ref('');

// ==================================================

const onVerifyComplete = (verifyCode) => {
  code.value = verifyCode;
  step.value = STEP_PROCESS;
};

const onSubmit = async () => {
  appStore.show('회원가입 중...');

  try {
    await authApi.signup(email.value, password.value, userName.value, code.value);
    toast.success('회원가입 성공! 환영합니다!');
    router.push({ name: 'login', query: { email: email.value } });
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};

const onInvalid = () => {
  toast.info('입력값을 확인해주세요.');
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
  step.value = STEP_EMAIL_VERIFY;
});
</script>
