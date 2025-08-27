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
      <button @click="refresh">검색</button>
    </div>

    <div>
      <TodoItem
        v-for="item in todos"
        :key="item.todoId"
        :todo="item"
        @detail="onDetail(item.todoId)"
        @toggle="onToggle(item.todoId, $event)"
        @update="onUpdate(item.todoId)"
        @delete="onDelete(item.todoId)"
      />
    </div>

    <Pagination v-model:page="filter.page" :size="filter.size" :total="total" />

    <!-- show create modal button -->
    <button @click="onCreate">작성</button>
  </div>
  <!-- detail modal -->
  <TodoDetailModal v-if="showDetailModal" v-model="showDetailModal" :id="activeId" />

  <!-- create modal -->
  <TodoCreateModal v-if="showCreateModal" v-model="showCreateModal" @confirm="refresh" />

  <!-- update modal -->
  <TodoUpdateModal v-if="showUpdateModal" v-model="showUpdateModal" @confirm="refresh" :id="activeId" />

  <!-- delete modal -->
  <TodoDeleteModal v-if="showDeleteModal" v-model="showDeleteModal" @confirm="refresh" :id="activeId" />
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { todosApi } from '@/services/todosApi';
import Pagination from '@/components/common/Pagination.vue';
import TodoItem from '@/components/todos/TodoItem.vue';
import TodoDetailModal from '@/components/todos/TodoDetailModal.vue';
import TodoCreateModal from '@/components/todos/TodoCreateModal.vue';
import TodoUpdateModal from '@/components/todos/TodoUpdateModal.vue';
import TodoDeleteModal from '@/components/todos/TodoDeleteModal.vue';

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
const activeId = ref(null);
const showDetailModal = ref(false);
const showCreateModal = ref(false);
const showUpdateModal = ref(false);
const showDeleteModal = ref(false);

const refresh = async () => {
  appStore.show('로딩 중...');

  try {
    const { status, searchType, keyword, page, size } = filter;
    const res = await todosApi.getTodos({ status, searchType, keyword, page, size });
    total.value = res.data.totalCount;
    todos.value = res.data.list;
  } catch (e) {
    console.log(e.message);
  } finally {
    appStore.hidden();
  }
};

const onToggle = async (todoId, completed) => {
  appStore.show('');

  try {
    await todosApi.patchTodo(todoId, completed);
    refresh();
  } catch (e) {
    console.log(e.message);
  } finally {
    appStore.hidden();
  }
};

const onDetail = (todoId) => {
  activeId.value = todoId;
  showDetailModal.value = true;
};

const onCreate = () => {
  showCreateModal.value = true;
};

const onUpdate = (todoId) => {
  activeId.value = todoId;
  showUpdateModal.value = true;
};

const onDelete = (todoId) => {
  activeId.value = todoId;
  showDeleteModal.value = true;
};

// 초기 1회 + page/size 변경마다 재조회
watch(
  () => [filter.page, filter.size],
  () => refresh(),
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
