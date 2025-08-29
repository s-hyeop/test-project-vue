<template>
  <section class="flex h-screen flex-wrap place-content-center">
    <div
      class="w-full max-w-sm rounded-2xl bg-black/30 px-4 py-8 shadow-xs backdrop-blur-lg md:px-8"
    >
      <div class="mb-6 flex flex-col items-center space-y-4">
        <h2 class="text-2xl font-bold">
          <slot name="title"></slot>
        </h2>
      </div>

      <div class="mb-3">
        <label class="mb-1 block text-sm" for="check-email">이메일</label>
        <input
          type="text"
          class="form-control form-control-glass w-full rounded-lg"
          id="check-email"
          v-model="email"
          autocomplete="off"
          readonly
        />
      </div>

      <div class="mb-5">
        <span class="mb-1 block text-sm">인증코드</span>
        <div class="flex gap-x-2">
          <input
            class="form-control form-control-glass w-full rounded-lg text-center text-lg font-bold"
            type="text"
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
            name="code"
          />
        </div>
      </div>

      <button
        class="btn btn-glass mt-2 w-full rounded-lg"
        @click="onVerify"
        :disabled="!isComplete"
      >
        인증
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { authApi } from '@/services/authApi';
import { toast } from '@/plugins/toast';

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

// ==================================================

const INPUT_LENGTH = 6;
const cells = ref(Array.from({ length: INPUT_LENGTH }, () => ''));
const inputRefs = ref([]);

const code = computed(() => cells.value.join(''));
const isComplete = computed(() => code.value.length === INPUT_LENGTH && !cells.value.includes(''));
const email = computed(() => props.email);

// ==================================================

const onVerify = async () => {
  if (!isComplete.value) return;
  appStore.show('확인 중...');

  try {
    if (props.verifyType === 'signup') {
      await authApi.verifySignupCode(email.value, code.value);
    } else {
      await authApi.verifyResetPasswordCode(email.value, code.value);
    }
    toast.success('이메일 인증이 완료되었습니다.');
    emit('complete', code.value);
  } catch (e) {
    toast.error(e.message);
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
const onInput = (i, e) => {
  let value = e.target.value || '';
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

// 붙혀넣기
const onPaste = (i, e) => {
  let text = (e.clipboardData || window.clipboardData).getData('text') || '';
  text = text.replace(/\D/g, '');
  if (!text) return;

  const chars = text.slice(0, INPUT_LENGTH - i).split('');
  for (let j = 0; j < chars.length; j++) cells.value[i + j] = chars[j];
  const last = i + chars.length - 1;
  focusAt(Math.min(last + 1, INPUT_LENGTH - 1));
};

// 이동 및 백스페이스
const onKeydown = (i, e) => {
  const key = e.key;
  if (key === 'Backspace') {
    e.preventDefault();
    if (cells.value[i]) {
      cells.value[i] = '';
    } else if (i > 0) {
      focusAt(i - 1);
      cells.value[i - 1] = '';
    }
  } else if (key === 'ArrowLeft') {
    e.preventDefault();
    if (i > 0) focusAt(i - 1);
  } else if (key === 'ArrowRight') {
    e.preventDefault();
    if (i < INPUT_LENGTH - 1) focusAt(i + 1);
  }
};

// ==================================================

onMounted(() => {
  const firstEmpty = cells.value.findIndex((value) => !value);
  focusAt(firstEmpty === -1 ? 0 : firstEmpty);
});
</script>
