<template>
  <div>TodosView</div>
  <div>
    <div>
      <span>{{ total }}개</span>
    </div>
    <div>
      <select v-model="filter.size">
        <option value="10">10개</option>
        <option value="20">20개</option>
        <option value="30">30개</option>
        <option value="40">40개</option>
        <option value="50">50개</option>
      </select>
      <select v-model="filter.status">
        <option value="">모두</option>
        <option value="complete">완료</option>
        <option value="incomplete">미완료</option>
      </select>
      <select v-model="filter.searchType">
        <option value="title">제목</option>
        <option value="content">내용</option>
      </select>
      <input type="text" v-model="filter.keyword" placeholder="검색어를 입력하세요." />
      <button @click="refreshTodos">검색</button>
    </div>

    <div>
      <TodoItem v-for="item in todos" :key="item.id" :todo="item" @complete="onComplete" @update="onUpdateTodo" @delete="onDeleteTodo" />
    </div>

    <Pagination v-model:page="filter.page" :size="filter.size" :total="total" />

    <!-- show create modal button -->
  </div>
  <!-- create modal -->
  <!-- update modal -->
  <!-- delete confirm modal -->
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { todosApi } from '@/services/todosApi';
import Pagination from '@/components/common/Pagination.vue';
import TodoItem from '@/components/todos/TodoItem.vue';

const route = useRoute();
const appStore = useAppStore();

const filter = reactive({
  status: '',
  searchType: 'title',
  keyword: '',
  page: 1,
  size: 10,
});
const todos = ref([]);
const total = ref(0);

const refreshTodos = async () => {
  appStore.show('로딩 중...');

  try {
    const { status, searchType, keyword, page, size } = filter;
    const response = await todosApi.getTodos({ status, searchType, keyword, page, size });
    total.value = response.data.totalCount;
    todos.value = response.data.list;
  } catch (error) {
    console.log(error.message);
  } finally {
    appStore.hidden();
  }
};

const onComplete = (todoId, completed) => {};

const onUpdateTodo = (todoId) => {};

const onDeleteTodo = (todoId) => {};

// 초기 1회 + page/size 변경마다 재조회
watch(
  () => [filter.page, filter.size],
  () => refreshTodos(),
  { immediate: true },
);

// 쿼리 -> 상태 초기 세팅 (숫자 변환)
onBeforeMount(() => {
  const queryPage = Number(route.query.page);
  const querySize = Number(route.query.size);
  if (!Number.isNaN(queryPage) && queryPage > 0) filter.page = queryPage;
  if (!Number.isNaN(querySize) && querySize > 0) filter.size = querySize;
});
</script>
