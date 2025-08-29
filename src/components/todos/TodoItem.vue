<template>
  <div
    class="todo-note mb-6 cursor-pointer break-inside-avoid p-4"
    :class="`todo-note-${todo.color || 'default'}`"
    @click="$emit('detail')"
  >
    <div class="mb-3 flex items-start justify-between">
      <h3
        class="flex-1 text-lg font-semibold"
        :class="todo?.completedAt ? 'text-gray-200 italic line-through' : 'text-white'"
      >
        {{ todo.title }}
      </h3>
      <div class="ml-2 flex space-x-2">
        <button
          @click.stop="$emit('update')"
          class="cursor-pointer text-blue-500 hover:text-blue-700"
        >
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
            class="lucide lucide-notebook-pen-icon lucide-notebook-pen size-4"
          >
            <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
            <path d="M2 6h4" />
            <path d="M2 10h4" />
            <path d="M2 14h4" />
            <path d="M2 18h4" />
            <path
              d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
            />
          </svg>
        </button>
        <button
          @click.stop="$emit('delete')"
          class="cursor-pointer text-red-500 hover:text-red-700"
        >
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
            class="lucide lucide-trash2-icon lucide-trash-2 size-4"
          >
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <p class="mb-4 text-sm whitespace-pre-wrap text-gray-300">{{ todo.content }}</p>

    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-400"> 마감: {{ formatDate(todo.dueAt) }} </span>
      </div>

      <div class="form-check-group form-check-lg cursor-pointer">
        <input
          type="checkbox"
          :checked="!!todo.completedAt"
          @click.stop=""
          @change="$emit('toggle', !todo.completedAt)"
          class="form-check"
        />
      </div>
    </div>

    <div v-if="todo.completedAt" class="mt-2">
      <span class="text-sm text-green-600"> 완료: {{ formatDateTime(todo.completedAt) }} </span>
    </div>
  </div>
</template>

<!-- <template>
  <div @click="$emit('detail')">
    <div>TodoItem</div>
    <div>{{ todo }}</div>
    <input
      type="checkbox"
      :checked="!!todo.completedAt"
      @click.stop=""
      @change="$emit('toggle', !todo.completedAt)"
    />
    <button @click.stop="$emit('update')">수정</button>
    <button @click.stop="$emit('delete')">삭제</button>
  </div>
  <hr />
</template> -->

<script setup>
const props = defineProps({
  todo: { type: Object, required: true },
});

const emit = defineEmits(['detail', 'toggle', 'update', 'delete']);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('ko-KR');
};
</script>
