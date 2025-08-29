<template>
  <section class="container-xl flex h-screen flex-wrap">
    <div class="w-full px-4 py-4 md:px-6">
      <form class="mb-2 flex w-full flex-col gap-x-2 sm:flex-row" @submit.prevent="refresh">
        <select v-model="filter.status" class="form-select w-25">
          <option value="">모두</option>
          <option value="complete">완료</option>
          <option value="incomplete">미완료</option>
        </select>

        <select v-model="filter.searchType" class="form-select w-25">
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>

        <div class="input-text-group">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            class="input-text"
            aria-label="Search query input"
            v-model="filter.keyword"
          />
          <button
            type="submit"
            class="inline-flex cursor-pointer px-3 py-1.5"
            aria-label="Submit search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-secondary lucide-search size-5 hover:text-violet-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </button>
        </div>
      </form>

      <div class="mb-2 flex items-center justify-between">
        <span>총 {{ total }}개</span>

        <select v-model="filter.size" class="form-select form-select-sm w-25">
          <option value="10">10개</option>
          <option value="20">20개</option>
          <option value="30">30개</option>
          <option value="40">40개</option>
          <option value="50">50개</option>
        </select>
      </div>

      <div v-if="todos.length === 0" class="py-8 text-center">
        <p class="text-lg text-white/80">할 일이 없습니다.</p>
      </div>

      <div v-else class="columns-1 gap-6 sm:columns-2 lg:columns-3">
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

      <Pagination class="pb-10" v-model:page="filter.page" :size="filter.size" :total="total" />
    </div>
  </section>

  <!-- Right Icon -->
  <div class="fixed right-3 bottom-22 flex flex-col gap-2 sm:right-6 sm:bottom-6">
    <!-- Write Icon Button -->
    <button
      class="text-inverse flex size-10 cursor-pointer items-center justify-center rounded-full bg-violet-400 opacity-75 shadow-md transition-colors duration-300 hover:bg-violet-500 md:size-12"
      @click="onCreate"
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
        class="lucide lucide-pencil-line-icon lucide-pencil-line"
      >
        <path d="M13 21h8" />
        <path d="m15 5 4 4" />
        <path
          d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
        />
      </svg>
    </button>
  </div>

  <!-- detail modal -->
  <TodoDetailModal v-if="showDetailModal" v-model="showDetailModal" :id="activeId" />

  <!-- create modal -->
  <TodoCreateModal v-if="showCreateModal" v-model="showCreateModal" @confirm="refresh" />

  <!-- update modal -->
  <TodoUpdateModal
    v-if="showUpdateModal"
    v-model="showUpdateModal"
    @confirm="refresh"
    :id="activeId"
  />

  <!-- delete modal -->
  <TodoDeleteModal
    v-if="showDeleteModal"
    v-model="showDeleteModal"
    @confirm="refresh"
    :id="activeId"
  />
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { todosApi } from '@/services/todosApi';
import { toast } from '@/plugins/toast';
import Pagination from '@/components/common/Pagination.vue';
import TodoItem from '@/components/todos/TodoItem.vue';
import TodoDetailModal from '@/components/todos/TodoDetailModal.vue';
import TodoCreateModal from '@/components/todos/TodoCreateModal.vue';
import TodoUpdateModal from '@/components/todos/TodoUpdateModal.vue';
import TodoDeleteModal from '@/components/todos/TodoDeleteModal.vue';

const route = useRoute();
const appStore = useAppStore();

// ==================================================

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

// ==================================================

const refresh = async () => {
  appStore.show('로딩 중...');

  try {
    const { status, searchType, keyword, page, size } = filter;
    const res = await todosApi.getTodos({ status, searchType, keyword, page, size });
    total.value = res.data.totalCount;
    todos.value = res.data.list;
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};

const onToggle = async (todoId, completed) => {
  appStore.show('');

  try {
    await todosApi.patchTodo(todoId, completed);
    toast.success(`TODO가 ${completed ? '완료' : '미완료'}되었습니다.`);
    refresh();
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};

const onDetail = (todoId) => {
  // activeId.value = todoId;
  // showDetailModal.value = true;
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

// ==================================================

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
