<template>
  <nav class="flex justify-center" aria-label="Page navigation">
    <ul class="pagination">
      <li
        class="first page-item"
        :class="{ disabled: isFirstPage }"
        :disabled="isFirstPage"
        @click="go(1)"
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
          class="lucide lucide-chevrons-left-icon lucide-chevrons-left"
        >
          <path d="m11 17-5-5 5-5" />
          <path d="m18 17-5-5 5-5" />
        </svg>
      </li>
      <li
        class="prev page-item"
        :class="{ disabled: isFirstPage }"
        :disabled="isFirstPage"
        @click="go(currentPage - 1)"
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
          class="lucide lucide-chevron-left-icon lucide-chevron-left"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </li>
      <template v-for="p in pages" :key="p">
        <li
          class="page page-item"
          :class="{ active: p === currentPage }"
          :aria-current="p === currentPage ? 'page' : null"
          @click="go(p)"
        >
          {{ p }}
        </li>
      </template>
      <li
        class="next page-item"
        :class="{ disabled: isLastPage }"
        :disabled="isLastPage"
        @click="go(currentPage + 1)"
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
          class="lucide lucide-chevron-right-icon lucide-chevron-right"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </li>
      <li
        class="last page-item"
        :class="{ disabled: isLastPage }"
        :disabled="isLastPage"
        @click="go(totalPages)"
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
          class="lucide lucide-chevrons-right-icon lucide-chevrons-right"
        >
          <path d="m6 17 5-5-5-5" />
          <path d="m13 17 5-5-5-5" />
        </svg>
      </li>
    </ul>
  </nav>
</template>

<!-- Pagination.vue -->
<script setup>
import { computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

defineOptions({ name: 'Pagination' });

const props = defineProps({
  total: { type: Number, required: true }, // 전체 아이템 수
  size: { type: Number, required: true }, // 페이지당 개수
  page: { type: Number, default: 1 }, // 현재 페이지(1-base)
  limit: { type: Number, default: 5 }, // 한 번에 보여줄 페이지 번호 수
  pageParam: { type: String, default: 'page' },
  sizeParam: { type: String, default: 'size' },
});

const emit = defineEmits(['update:page']);

// ==================================================

const totalPages = computed(() => {
  const tp = Math.ceil((props.total ?? 0) / (props.size || 1));
  return Math.max(1, tp);
});

const currentPage = computed(() => {
  return Math.min(Math.max(props.page ?? 1, 1), totalPages.value);
});

const isFirstPage = computed(() => currentPage.value === 1);
const isLastPage = computed(() => currentPage.value === totalPages.value);

const pages = computed(() => {
  const n = totalPages.value;
  if (n <= 0) return [];
  const limit = Math.max(1, props.limit || 5);
  let start = currentPage.value - Math.floor(limit / 2);
  if (start < 1) start = 1;
  let end = start + limit - 1;
  if (end > n) {
    end = n;
    start = Math.max(1, end - limit + 1);
  }
  const arr = [];
  for (let p = start; p <= end; p++) arr.push(p);
  return arr;
});

// ==================================================

const pushQuery = (nextPage) => {
  const q = { ...route.query };
  q[props.pageParam] = String(nextPage);
  q[props.sizeParam] = String(props.size);
  router.push({ query: q });
};

const go = (nextPage) => {
  const clamped = Math.min(Math.max(nextPage, 1), totalPages.value);
  if (clamped === currentPage.value) return;
  emit('update:page', clamped);
  pushQuery(clamped);
};

// ==================================================

// URL 쿼리가 바뀌었을 때 컴포넌트도 따라가도록(뒤로가기 등)
watch(
  () => route.query[props.pageParam],
  (v) => {
    const qp = Number.parseInt(v, 10);
    if (!Number.isNaN(qp) && qp !== props.page) {
      const clamped = Math.min(Math.max(qp, 1), totalPages.value);
      emit('update:page', clamped);
    }
  },
);

// total/size가 변해 총 페이지가 줄면 현재 페이지를 보정
watch(
  totalPages,
  (tp) => {
    if (currentPage.value > tp) go(tp);
  },
  { immediate: true },
);

// size가 바뀌면 쿼리의 size도 함께 갱신
watch(
  () => props.size,
  () => pushQuery(currentPage.value),
);
</script>
