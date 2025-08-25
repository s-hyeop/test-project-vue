<template>
  <div>ResetPasswordForm</div>
  <div>
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
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';
import { authApi } from '@/services/authApi';

const appStore = useAppStore();

const props = defineProps({
  email: { type: String, default: '' },
  code: { type: String, default: '' },
});

const emit = defineEmits(['complete']);

// ==================================================

const password = ref('');
const confirmPassword = ref('');

// ==================================================

const onResetPasswordClick = async () => {
  appStore.show('비밀번호 재설정 중...');

  try {
    // TO-DO: Vaild(비밀번호 규격[규격, 길이])
    if (password.value != confirmPassword.value) {
      console.log('비밀번호가 일치하지 않음');
      return;
    }

    const e = props.email;
    const p = password.value;
    const c = props.code;
    await authApi.resetPassword(e, p, c);
    emit('complete');
  } catch (error) {
    console.log(error.message);
  } finally {
    appStore.hidden();
  }
};
</script>
