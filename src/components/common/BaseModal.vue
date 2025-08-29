<!-- <base-modal
  v-model="Boolean"
  :locked="Boolean"
  :showConfirm="Boolean"
  :showCancel="Boolean"
  :btnConfirmText="확인"
  :btnCancelText="취소"
  @confirm=""
  @cancel=""
>
  <template #title></template>
  <template #content></template>
</base-modal> -->

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="modal-backdrop" @click="onBackdrop"></div>
    </Transition>

    <Transition name="pop">
      <div
        v-if="open"
        class="modal-wrap"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        ref="dialogRef"
        @keydown.esc.stop.prevent="onEsc"
        @click.stop
        tabindex="-1"
      >
        <header class="modal-header">
          <div class="modal-title">
            <slot name="title"></slot>
          </div>
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
        <section class="modal-body">
          <slot name="content"></slot>
        </section>
        <footer class="modal-footer">
          <button v-if="showConfirm" @click="confirm" class="btn btn-blue">
            {{ btnConfirmText }}
          </button>
          <button v-if="showCancel" @click="cancel" class="btn text-white">
            {{ btnCancelText }}
          </button>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
  showConfirm: { type: Boolean, default: true },
  showCancel: { type: Boolean, default: true },
  btnConfirmText: { type: String, default: '확인' },
  btnCancelText: { type: String, default: '취소' },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

// ==================================================

const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;
const dialogRef = ref(null);

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// ==================================================

const onBackdrop = () => {
  if (props.locked) return;
  cancel();
};

const onEsc = () => {
  if (props.locked) return;
  cancel();
};

const close = () => {
  if (props.locked) return;
  cancel();
};

const cancel = () => {
  open.value = false;
  emit('cancel');
};

const confirm = () => {
  open.value = false;
  emit('confirm');
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
