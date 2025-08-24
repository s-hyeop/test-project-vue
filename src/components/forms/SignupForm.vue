<template>
  <div>SignupForm</div>
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
    <div>
      <label>사용자 이름</label>
      <input type="text" v-model="userName" />
    </div>
    <button @click="onSignupClick">회원가입</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { authApi } from '@/services/authApi';

const props = defineProps({
  email: { type: String, default: '' },
  code: { type: String, default: '' },
});

const emit = defineEmits(['complete']);

const password = ref('');
const confirmPassword = ref('');
const userName = ref('');

const onSignupClick = async () => {
  // TO-DO: Vaild
  if (password.value != confirmPassword.value) {
    console.log('비밀번호가 일치하지 않음');
    return;
  }

  try {
    const e = props.email;
    const p = password.value;
    const u = userName.value;
    const c = props.code;
    await authApi.signup(e, p, u, c);
    emit('complete');
  } catch (error) {
    console.log(error.message);
  }
};
</script>
