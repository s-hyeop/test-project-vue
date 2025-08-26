<template>
  <nav class="pagination" aria-label="Pagination">
    <ul>
      <li>
        <button class="first" :class="{ disable: isFirstPage }" :disabled="isFirstPage" @click="go(1)">처음</button>
      </li>

      <li>
        <button class="prev" :class="{ disable: isFirstPage }" :disabled="isFirstPage" @click="go(currentPage - 1)">이전</button>
      </li>

      <li v-for="p in pages" :key="p">
        <button class="page" :class="{ active: p === currentPage }" :aria-current="p === currentPage ? 'page' : null" @click="go(p)">{{ p }}</button>
      </li>

      <li>
        <button class="next" :class="{ disable: isLastPage }" :disabled="isLastPage" @click="go(currentPage + 1)">다음</button>
      </li>

      <li>
        <button class="last" :class="{ disable: isLastPage }" :disabled="isLastPage" @click="go(totalPages)">마지막</button>
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

const pushQuery = (nextPage) => {
  const q = { ...route.query };
  q[props.pageParam] = String(nextPage);
  q[props.sizeParam] = String(props.size);
  router.push({ query: q });
};

function go(nextPage) {
  const clamped = Math.min(Math.max(nextPage, 1), totalPages.value);
  if (clamped === currentPage.value) return;
  emit('update:page', clamped);
  pushQuery(clamped);
}

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
