<template>
  <EmailCodeCheck
    v-if="step === STEP_EMAIL_VERIFY"
    :email="email"
    :verifyType="'signup'"
    @complete="onVerifyComplete"
  >
    <template #title>이메일 인증</template>
  </EmailCodeCheck>

  <section class="flex h-screen flex-wrap place-content-center" v-show="step === STEP_PROCESS">
    <div
      class="w-full max-w-sm rounded-2xl border-1 border-gray-100/15 bg-black/30 px-4 py-8 shadow-xs backdrop-blur-lg md:px-8"
    >
      <div class="mb-6 flex flex-col items-center space-y-4">
        <h2 class="text-2xl font-bold">회원가입</h2>
      </div>

      <Form @submit="onSubmit" @invalid-submit="onInvalid">
        <div class="mb-3">
          <label class="mb-1 block text-sm" for="signup-email">이메일</label>
          <Field
            type="text"
            class="form-control form-control-glass w-full rounded-lg"
            id="signup-email"
            name="email"
            v-model="email"
            autocomplete="off"
            readonly
          />
        </div>

        <div class="mb-3">
          <label class="mb-1 block text-sm" for="signup-password">비밀번호</label>
          <Field
            type="password"
            class="form-control form-control-glass w-full rounded-lg"
            id="signup-password"
            name="signup-password"
            v-model="password"
            rules="rule-password"
            placeholder="비밀번호를 입력해 주세요."
            autocomplete="off"
          />
          <ErrorMessage class="invalid-feedback" name="signup-password" />
        </div>

        <div class="mb-3">
          <label class="mb-1 block text-sm" for="signup-confirmPassword">비밀번호 확인</label>
          <Field
            type="password"
            class="form-control form-control-glass w-full rounded-lg"
            id="signup-confirmPassword"
            name="signup-confirmPassword"
            v-model="confirmPassword"
            rules="rule-confirmPassword:signup-password"
            placeholder="비밀번호를 다시 입력해 주세요."
            autocomplete="off"
          />
          <ErrorMessage class="invalid-feedback" name="signup-confirmPassword" />
        </div>

        <div class="mb-5">
          <label class="mb-1 block text-sm" for="signup-username">이름</label>
          <Field
            type="text"
            class="form-control form-control-glass w-full rounded-lg"
            id="signup-username"
            name="signup-username"
            v-model="username"
            rules="rule-username"
            placeholder="이름을 입력해 주세요."
            autocomplete="off"
          />
          <ErrorMessage class="invalid-feedback" name="signup-username" />
        </div>

        <button type="submit" class="btn btn-glass mt-2 w-full rounded-lg">회원가입</button>
      </Form>
    </div>
  </section>
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
const username = ref('');
const code = ref('');

// ==================================================

const onVerifyComplete = (verifyCode) => {
  code.value = verifyCode;
  step.value = STEP_PROCESS;
};

const onSubmit = async () => {
  appStore.show('회원가입 중...');

  try {
    await authApi.signup(email.value, password.value, username.value, code.value);
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
