<template>
  <section class="flex h-screen flex-wrap place-content-center">
    <div
      class="w-full max-w-sm rounded-2xl bg-black/30 px-4 py-8 shadow-xs backdrop-blur-lg md:px-8"
    >
      <div class="mb-6 flex flex-col items-center space-y-4">
        <h2 class="text-2xl font-bold">TODO</h2>
      </div>

      <Form @submit="onSubmit" @invalid-submit="onInvalid">
        <div class="mb-5">
          <label class="mb-1 block text-sm" for="auth-email">이메일</label>
          <Field
            type="text"
            class="form-control form-control-glass w-full rounded-lg"
            id="auth-email"
            name="email"
            v-model="email"
            rules="rule-email"
            placeholder="email@example.com"
            autocomplete="off"
          />
          <ErrorMessage class="invalid-feedback" name="email" />
        </div>

        <button type="submit" class="btn btn-glass mt-2 w-full rounded-lg">다음으로</button>
      </Form>
    </div>
  </section>

  <base-modal
    v-if="showModal"
    v-model="showModal"
    :btnConfirmText="'회원가입'"
    :btnCancelText="'취소'"
    @confirm="onSignupConfirm"
  >
    <template #title>알림</template>
    <template #content>[{{ email }}]해당 계정으로 회원가입을 하시겠습니까?</template>
  </base-modal>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useAppStore } from '@/stores/app';
import { authApi } from '@/services/authApi';
import { toast } from '@/plugins/toast';
import BaseModal from '@/components/common/BaseModal.vue';

const router = useRouter();
const appStore = useAppStore();

// ==================================================

const email = ref(null);
const showModal = ref(false);

// ==================================================

const onSubmit = async () => {
  appStore.show('확인 중...');

  try {
    const res = await authApi.checkEmailExist(email.value);
    if (res.data.exists) {
      router.push({ name: 'login', query: { email: email.value } });
    } else {
      showModal.value = true;
    }
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};

const onInvalid = () => {
  toast.info('입력값을 확인해주세요.');
};

const onSignupConfirm = async () => {
  appStore.show('인증코드 전송 중...');
  try {
    await authApi.sendSignupCode(email.value);
    toast.success(`인증코드가 ${email.value}로 전송되었습니다.`);
    router.push({ name: 'signup', query: { email: email.value } });
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};
</script>
