<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="modal-backdrop" @click="onBackdrop"></div>
    </Transition>

    <Transition name="pop">
      <Form
        @submit="confirm"
        @invalid-submit="onInvalid"
        v-if="open"
        class="modal-wrap"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
        ref="dialogRef"
        @keydown.esc.stop.prevent="onEsc"
        @click.stop
        tabindex="-1"
      >
        <header class="modal-header">
          <div class="modal-title">비밀번호 재설정</div>
          <button @click="close" class="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-x-icon lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>
        <section class="modal-body" :id="contentId">
          <div class="mb-3">
            <label class="mb-1 block text-sm" for="password">현재 비밀번호</label>
            <Field
              type="password"
              class="form-control form-control-glass w-full rounded-lg"
              id="password"
              name="password"
              v-model="password"
              placeholder="현재 비밀번호를 입력해 주세요."
              autocomplete="off"
            />
          </div>
          <div class="mb-3">
            <label class="mb-1 block text-sm" for="newPassword">새로운 비밀번호</label>
            <Field
              type="password"
              class="form-control form-control-glass w-full rounded-lg"
              id="newPassword"
              name="newPassword"
              v-model="newPassword"
              rules="rule-password"
              placeholder="새로운 비밀번호를 입력해 주세요."
              autocomplete="off"
            />
            <ErrorMessage class="invalid-feedback" name="newPassword" />
          </div>
          <div class="mb-3">
            <label class="mb-1 block text-sm" for="confirmPassword">비밀번호 확인</label>
            <Field
              type="password"
              class="form-control form-control-glass w-full rounded-lg"
              id="confirmPassword"
              name="confirmPassword"
              v-model="confirmPassword"
              rules="rule-confirmPassword:newPassword"
              placeholder="비밀번호를 다시 입력해 주세요."
              autocomplete="off"
            />
            <ErrorMessage class="invalid-feedback" name="confirmPassword" />
          </div>
        </section>
        <footer class="modal-footer">
          <button type="submit" :disabled="submitting" class="btn btn-blue">
            {{ submitting ? '비밀번호 변경 중...' : '비밀번호 변경' }}
          </button>
          <button @click="cancel" :disabled="submitting" class="btn text-inverse">취소</button>
        </footer>
      </Form>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { usersApi } from '@/services/usersApi';
import { toast } from '@/plugins/toast';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// ==================================================

const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;
const contentId = `modal-content-${Math.random().toString(36).slice(2)}`;
const dialogRef = ref(null);
const submitting = ref(false);
const password = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// ==================================================

const onBackdrop = () => cancel();

const onEsc = () => cancel();

const close = () => cancel();

const cancel = () => (open.value = false);

const confirm = async () => {
  if (submitting.value) return;
  submitting.value = true;

  try {
    await usersApi.changePassword(password.value, newPassword.value);
    toast.success('비밀번호 변경이 완료되었습니다.');
    emit('confirm');
    open.value = false;
  } catch (e) {
    toast.error(e.message);
  } finally {
    submitting.value = false;
  }
};

const onInvalid = () => {
  toast.info('입력값을 확인해주세요.');
};

// ==================================================

watch(
  open,
  (v) => {
    if (typeof document === 'undefined') return;
    if (!document.body) return;
    document.body.classList.toggle('modal-scrren', v);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return;
  if (!document.body) return;
  document.body.classList.remove('modal-scrren');
});
</script>
