<!-- <base-modal
  v-model="Boolean"
  locked="Boolean"
  showConfirm="Boolean"
  showCancel="Boolean"
  btnConfirmText="확인"
  btnCancelText="취소"
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
          <button @click="close">X</button>
        </header>
        <section class="modal-body">
          <slot name="content"></slot>
        </section class="modal-footer">
        <footer class="modal-footer">
          <button v-if="showConfirm" @click="confirm">{{ btnConfirmText }}</button>
          <button v-if="showCancel" @click="cancel">{{ btnCancelText }}</button>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // Modal Show
  locked: { type: Boolean, default: false },
  showConfirm: { type: Boolean, default: true },
  showCancel: { type: Boolean, default: true },
  btnConfirmText: { type: String, default: '확인' },
  btnCancelText: { type: String, default: '취소' },
});

const emit = defineEmits(['update:modalValue', 'confirm', 'cancel']);

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modalValue', value),
});
const dialogRef = ref(null);
const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;

const onBackdrop = () => {
  if (props.locked) return;
  cancel();
};

const onEsc = () => {
  if (props.locked) return;
  cancel();
};

const cancel = () => {
  emit('cancel');
  open.value = false;
};

const confirm = () => {
  emit('confirm');
  open.value = false;
};

// 스크롤 락 & 포커스
let prevOverflow = '';
watch(open, (v) => {
  if (typeof document === 'undefined') return;
  if (v) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // 다음 틱에 포커스
    requestAnimationFrame(() => {
      dialogRef.value?.focus?.();
    });
  } else {
    document.body.style.overflow = prevOverflow || '';
  }
});

onMounted(() => {
  if (open.value) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
});

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = prevOverflow || '';
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
}

.modal-wrap {
  position: fixed;
  inset: 0;
  display: block;
  align-self: anchor-center;
  place-items: center;
  z-index: 1000;
  outline: none;
}

.modal-wrap > .modal-header,
.modal-wrap > .modal-body,
.modal-wrap > .modal-footer {
  max-width: min(640px, calc(100vw - 32px));
  background: #fff;
  color: #111827; /* gray-900 */
}

.modal-wrap .modal-header,
.modal-wrap .modal-body,
.modal-wrap .modal-footer {
  width: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #e5e7eb; /* gray-200 */
}
.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.modal-body {
  padding: 20px;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 14px 20px;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}
.pop-enter-from,
.pop-leave-to {
  transform: translateY(6px) scale(0.98);
  opacity: 0;
}
</style>
