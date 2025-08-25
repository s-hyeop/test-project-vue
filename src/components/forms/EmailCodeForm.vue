<template>
  <div>{{ title }} 이메일 인증</div>
  <div>
    <input
      v-for="(_, i) in cells"
      :key="i"
      :ref="(el) => (inputRefs[i] = el)"
      v-model="cells[i]"
      maxlength="1"
      inputmode="numeric"
      autocomplete="one-time-code"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @paste.prevent="onPaste(i, $event)"
    />
    <button @click="onVerifyClick" :disabled="!isComplete">인증</button>
  </div>
  <div>{{ email }}로 인증코드가 전송되었습니다.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { authApi } from '@/services/authApi';

const INPUT_LENGTH = 6;

const appStore = useAppStore();

const props = defineProps({
  email: { type: String, default: '' },
  verifyType: {
    type: String,
    default: null,
    validator: (value) => ['signup', 'reset-password'].includes(value),
  },
});

const emit = defineEmits(['complete']);

const cells = ref(Array.from({ length: INPUT_LENGTH }, () => ''));
const inputRefs = ref([]);

const code = computed(() => cells.value.join(''));
const isComplete = computed(() => code.value.length === INPUT_LENGTH && !cells.value.includes(''));
const title = computed(() => (props.verifyType === 'reset-password' ? '비밀번호 초기화' : '회원가입'));
const email = computed(() => props.email);

const onVerifyClick = async () => {
  if (!isComplete.value) return;
  appStore.show('확인 중...');

  try {
    const e = email.value;
    const c = code.value;
    if (props.verifyType === 'signup') {
      await authApi.verifySignupCode(e, c);
    } else {
      await authApi.verifyResetPasswordCode(e, c);
    }
    emit('complete', c);
  } catch (error) {
    console.log(error.message);
  } finally {
    appStore.hidden();
  }
};

// input 포커스
const focusAt = (i) => {
  inputRefs.value[i]?.focus?.();
  inputRefs.value[i]?.select?.();
};

// 입력시 숫자 검증
const onInput = (i, event) => {
  let value = event.target.value || '';
  value = value.replace(/\D/g, '');

  if (value.length <= 1) {
    cells.value[i] = value;
    if (value && i < INPUT_LENGTH - 1) focusAt(i + 1);
    return;
  }

  const chars = value.split('');
  cells.value[i] = chars.shift() || '';
  let k = i + 1;
  for (const ch of chars) {
    if (k >= INPUT_LENGTH) break;
    cells.value[k++] = ch.replace(/\D/g, '');
  }
  focusAt(Math.min(k, INPUT_LENGTH - 1));
};

const onPaste = (i, event) => {
  let text = (event.clipboardData || window.clipboardData).getData('text') || '';
  text = text.replace(/\D/g, '');
  if (!text) return;

  const chars = text.slice(0, INPUT_LENGTH - i).split('');
  for (let j = 0; j < chars.length; j++) cells.value[i + j] = chars[j];
  const last = i + chars.length - 1;
  focusAt(Math.min(last + 1, INPUT_LENGTH - 1));
};

const onKeydown = (i, event) => {
  const key = event.key;
  if (key === 'Backspace') {
    event.preventDefault();
    if (cells.value[i]) {
      cells.value[i] = '';
    } else if (i > 0) {
      focusAt(i - 1);
      cells.value[i - 1] = '';
    }
  } else if (key === 'ArrowLeft') {
    event.preventDefault();
    if (i > 0) focusAt(i - 1);
  } else if (key === 'ArrowRight') {
    event.preventDefault();
    if (i < INPUT_LENGTH - 1) focusAt(i + 1);
  }
};

onMounted(() => {
  const firstEmpty = cells.value.findIndex((value) => !value);
  focusAt(firstEmpty === -1 ? 0 : firstEmpty);
});
</script>
