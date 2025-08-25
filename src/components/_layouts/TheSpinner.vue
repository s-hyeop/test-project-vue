<!-- components/TheSpinner.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="loading" class="fs-overlay" role="status" aria-live="polite" aria-label="로딩 중">
        <div class="fs-box">
          <div class="spinner"></div>
          <p v-if="message" class="fs-msg">{{ message }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const { loading, message } = storeToRefs(appStore);

// ==================================================

// 스크롤 락
let prevOverflow = '';
watch(
  loading,
  (value) => {
    if (typeof document === 'undefined') return;
    if (value) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflow || '';
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = prevOverflow || '';
  }
});

// ==================================================
</script>

<style scoped>
.fs-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1200;
}
.fs-box {
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
}
.spinner {
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  border: 4px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.fs-msg {
  margin: 0;
  color: #fff;
  font-weight: 600;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
