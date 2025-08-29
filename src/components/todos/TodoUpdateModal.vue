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
          <div class="modal-title">TODO 수정</div>
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
            <label class="mb-1 block text-sm" for="todoTitle">제목</label>
            <Field
              type="text"
              class="form-control form-control-glass w-full rounded-lg"
              id="todoTitle"
              name="todoTitle"
              v-model="updateObj.title"
              rules="rule-todoTitle"
              placeholder="제목을 입력해 주세요."
              autocomplete="off"
            />
            <ErrorMessage class="invalid-feedback" name="todoTitle" />
          </div>

          <div class="mb-3">
            <label class="mb-1 block text-sm" for="todoContent">내용</label>
            <Field
              as="textarea"
              class="form-textarea form-textarea-glass w-full rounded-lg"
              id="todoContent"
              name="todoContent"
              v-model="updateObj.content"
              rules="rule-todoContent"
              placeholder="내용을 입력해 주세요."
              autocomplete="off"
            />
            <ErrorMessage class="invalid-feedback" name="todoContent" />
          </div>

          <div class="mb-3">
            <label class="mb-1 block text-sm" for="todoDueAt">마감일</label>
            <Field
              type="date"
              class="form-control form-control-glass w-full rounded-lg"
              id="todoDueAt"
              name="todoDueAt"
              v-model="updateObj.dueAt"
              rules="rule-todoDueAt"
              placeholder="마감일을 선택해 주세요."
              autocomplete="off"
            />
            <ErrorMessage class="invalid-feedback" name="todoDueAt" />
          </div>

          <div class="mb-3">
            <label class="mb-1 block text-sm">색상</label>

            <div class="flex space-x-3">
              <label v-for="color in colors" :key="color.value" class="relative cursor-pointer">
                <Field
                  type="radio"
                  name="todoColor"
                  v-model="updateObj.color"
                  :value="color.value"
                  rules="rule-todoColor"
                  class="sr-only"
                />
                <div
                  class="h-8 w-8 rounded-full border-2 transition-all"
                  :class="[
                    color.class,
                    updateObj.color === color.value ? 'ring-2 ring-gray-400 ring-offset-2' : '',
                  ]"
                ></div>
                <div
                  v-if="updateObj.color === color.value"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </label>
            </div>
            <ErrorMessage class="invalid-feedback" name="todoColor" />
          </div>

          <div class="mb-3">
            <label for="todoSequence">순서</label>
            <Field
              type="text"
              class="form-control form-control-glass w-full rounded-lg"
              id="todoSequence"
              name="todoSequence"
              v-model="updateObj.sequence"
              rules="rule-todoSequence"
              placeholder="순서를 입력해 주세요."
              autocomplete="off"
            />
            <ErrorMessage class="invalid-feedback" name="todoSequence" />
          </div>
        </section>
        <footer class="modal-footer">
          <button type="submit" :disabled="submitting" class="btn btn-blue">
            {{ submitting ? '수정 중...' : '수정' }}
          </button>
          <button @click="cancel" :disabled="submitting" class="btn text-inverse">취소</button>
        </footer>
      </Form>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useAppStore } from '@/stores/app';
import { todosApi } from '@/services/todosApi';
import { toast } from '@/plugins/toast';

const appStore = useAppStore();

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  id: { type: String, required: true },
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// ==================================================

const colors = [
  { value: 'red', class: 'bg-red-400/75 border-none' },
  { value: 'blue', class: 'bg-blue-400/75 border-none' },
  { value: 'green', class: 'bg-green-400/75 border-none' },
  { value: 'yellow', class: 'bg-yellow-400/75 border-none' },
  { value: 'purple', class: 'bg-purple-400/75 border-none' },
];

const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;
const contentId = `modal-content-${Math.random().toString(36).slice(2)}`;
const dialogRef = ref(null);
const submitting = ref(false);
const updateObj = reactive({ title: '', content: '', color: '', dueAt: '', sequence: '' });

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const todoId = computed(() => props.id);

// ==================================================

const onBackdrop = () => cancel();

const onEsc = () => cancel();

const close = () => cancel();

const cancel = () => (open.value = false);

const confirm = async () => {
  if (submitting.value) return;
  submitting.value = true;

  try {
    const { title, content, color, dueAt, sequence } = updateObj;
    await todosApi.updateTodo(todoId.value, title, content, color, dueAt, sequence);
    toast.success('TODO가 수정되었습니다.');
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
  () => [open.value, props.id],
  async ([isOpen, id], _) => {
    if (!isOpen || !id) return;
    appStore.show();

    try {
      const res = await todosApi.getTodo(id);

      updateObj.title = res.data.title;
      updateObj.content = res.data.content;
      updateObj.color = res.data.color;
      updateObj.dueAt = res.data.dueAt;
      updateObj.sequence = res.data.sequence;
    } catch (e) {
      toast.error(e.message);
      cancel();
    } finally {
      appStore.hidden();
    }
  },
  { immediate: true },
);

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
