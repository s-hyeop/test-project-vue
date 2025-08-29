<template>
  <section class="container-lg flex flex-wrap">
    <div
      class="mt-4 w-full rounded-xl border border-gray-800/50 bg-linear-to-bl from-gray-800/50 via-gray-900/50 to-gray-950/50 p-4"
    >
      <div class="grid grid-cols-1 items-center gap-x-10 gap-y-5 sm:grid-cols-3">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-white sm:text-3xl">
            {{
              todoStatisticsObj.totalCount == 0
                ? 0
                : ((todoStatisticsObj.completedCount / todoStatisticsObj.totalCount) * 100).toFixed(
                    2,
                  )
            }}%
          </h3>
          <p class="mt-1 text-sm text-gray-400 sm:text-base">Total Completion Rate</p>
        </div>

        <div class="text-center">
          <h3 class="text-lg font-semibold text-white sm:text-3xl">
            {{ todoStatisticsObj.todayCompletedCount }}
          </h3>
          <p class="mt-1 text-sm text-gray-400 sm:text-base">Today’s Completions</p>
        </div>

        <div class="text-center">
          <h3 class="text-lg font-semibold text-white sm:text-3xl">
            {{ todoStatisticsObj.totalCount - todoStatisticsObj.completedCount }}
          </h3>
          <p class="mt-1 text-sm text-gray-400 sm:text-base">Incomplete Todos</p>
        </div>
      </div>
    </div>
  </section>

  <section class="container-lg flex flex-wrap">
    <div
      class="mt-4 w-full overflow-hidden rounded-xl border border-gray-800/50 bg-linear-to-bl from-gray-800/50 via-gray-900/50 to-gray-950/50 p-4"
    >
      <div
        class="flex flex-col gap-3 border-b border-gray-900/50 px-2 pt-2 pb-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <h2 class="truncate text-base font-semibold text-white">회원 프로필</h2>

        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button type="button" class="btn btn-sm btn-glass" @click="onUpdateUserDetail">
            정보 변경
          </button>
          <button type="button" class="btn btn-sm btn-glass" @click="onChangePassword">
            비밀번호 변경
          </button>
        </div>
      </div>

      <div class="px-2 pt-4 pb-2">
        <dl class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <dt class="text-sm font-medium text-gray-300">이메일</dt>
          <dd class="text-whitegray-100 text-sm break-words sm:col-span-2">
            {{ userObj.email }}
          </dd>

          <dt class="text-sm font-medium text-gray-300">이름</dt>
          <dd class="text-whitegray-100 text-sm sm:col-span-2">
            {{ userObj.userName }}
          </dd>

          <dt class="text-sm font-medium text-gray-300">가입일</dt>
          <dd class="text-whitegray-100 text-sm sm:col-span-2">
            {{ formatDateTime(userObj.createdAt) }}
          </dd>
        </dl>
      </div>
    </div>
  </section>

  <section class="container-lg flex flex-wrap">
    <div
      class="mt-4 w-full overflow-hidden rounded-xl border border-gray-800/50 bg-linear-to-bl from-gray-800/50 via-gray-900/50 to-gray-950/50 p-4"
    >
      <div
        class="flex flex-col gap-3 border-b border-gray-900/50 px-2 pt-2 pb-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <h2 class="truncate text-base font-semibold text-white">접속 기기 정보</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y-1 divide-gray-900">
          <thead class="text-left">
            <tr class="*:text-gray-200">
              <th class="px-3 py-2 whitespace-nowrap">기기 종료</th>
              <th class="px-3 py-2 whitespace-nowrap">로그인 날짜</th>
              <th class="px-3 py-2 text-end whitespace-nowrap">actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-900">
            <template v-for="token in tokenObj" :key="token.refreshToken">
              <tr class="*:text-gray-300 *:first:font-medium">
                <td class="px-3 py-2 whitespace-nowrap">{{ token.clientOs }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ formatDateTime(token.createdAt) }}</td>
                <td class="px-3 py-2 text-end whitespace-nowrap">
                  <button class="btn btn-sm btn-glass" @click="onRemoteLogout(token.refreshToken)">
                    로그아웃
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- update password modal -->
  <ChangePasswordModal
    v-if="showChangePasswordModal"
    v-model="showChangePasswordModal"
    @confirm="refresh"
  />

  <!-- update user detail modal -->
  <UpdateUserDetailModal
    v-if="showUpdateUserDetailModal"
    v-model="showUpdateUserDetailModal"
    @confirm="refresh"
  />

  <!-- remtoe logout modal -->
  <RemoteLogoutModal
    v-if="showRemoteLogoutModal"
    v-model="showRemoteLogoutModal"
    @confirm="refresh"
    :id="activeId"
  />
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useAppStore } from '@/stores/app';
import { authApi } from '@/services/authApi';
import { todosApi } from '@/services/todosApi';
import { usersApi } from '@/services/usersApi';
import { toast } from '@/plugins/toast';
import ChangePasswordModal from '@/components/mypage/ChangePasswordModal.vue';
import UpdateUserDetailModal from '@/components/mypage/UpdateUserDetailModal.vue';
import RemoteLogoutModal from '@/components/mypage/RemoteLogoutModal.vue';

const appStore = useAppStore();

// ==================================================

const todoStatisticsObj = ref({});
const userObj = ref({});
const tokenObj = ref([]);
const activeId = ref(null);
const showChangePasswordModal = ref(false);
const showUpdateUserDetailModal = ref(false);
const showRemoteLogoutModal = ref(false);

// ==================================================

const refresh = async () => {
  appStore.show('로딩 중...');

  try {
    const todoRes = await todosApi.getTodoStatistics();
    todoStatisticsObj.value = todoRes.data;

    const userRes = await usersApi.getUserDetail();
    userObj.value = userRes.data;

    const tokenRes = await authApi.getTokens();
    tokenObj.value = tokenRes.data;
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};

const onChangePassword = () => {
  showChangePasswordModal.value = true;
};

const onUpdateUserDetail = () => {
  showUpdateUserDetailModal.value = true;
};

const onRemoteLogout = (token) => {
  activeId.value = token;
  showRemoteLogoutModal.value = true;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('ko-KR');
};

onBeforeMount(() => {
  refresh();
});
</script>
