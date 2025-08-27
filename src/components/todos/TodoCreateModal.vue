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
        :aria-describedby="contentId"
        ref="dialogRef"
        @keydown.esc.stop.prevent="onEsc"
        @click.stop
        tabindex="-1"
      >
        <header class="modal-header">
          <div class="modal-title">새로운 TODO 작성</div>
          <button @click="close">X</button>
        </header>
        <section class="modal-body" :id="contentId">
          <div>
            <label for="">제목</label>
            <input type="text" v-model="createObj.title" />
          </div>
          <div>
            <label for="">내용</label>
            <textarea v-model="createObj.content"></textarea>
          </div>
          <div>
            <label for="">마감일</label>
            <input type="date" v-model="createObj.dueAt" />
          </div>
          <div>
            <label for="">색상</label>
            <input type="text" v-model="createObj.color" />
          </div>
        </section>
        <footer class="modal-footer">
          <button @click="confirm" :disabled="submitting">{{ submitting ? '작성 중...' : '작성' }}</button>
          <button @click="cancel" :disabled="submitting">취소</button>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { todosApi } from '@/services/todosApi';
import { toast } from '@/plugins/toast';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// ==================================================

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const dialogRef = ref(null);
const submitting = ref(false);
const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;
const contentId = `modal-content-${Math.random().toString(36).slice(2)}`;
const createObj = reactive({ title: '', content: '', color: '', dueAt: '' });

// ==================================================

const onBackdrop = () => cancel();

const onEsc = () => cancel();

const close = () => cancel();

const cancel = () => (open.value = false);

const confirm = async () => {
  if (submitting.value) return;
  submitting.value = true;

  try {
    const { title, content, color, dueAt } = createObj;

    // TO-DO: 유효성 검사.

    await todosApi.createTodo(title, content, color, dueAt);
    toast.success('새로운 TODO가 추가되었습니다.');
    emit('confirm');
    open.value = false;
  } catch (e) {
    toast.error(e.message);
  } finally {
    submitting.value = false;
  }
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
