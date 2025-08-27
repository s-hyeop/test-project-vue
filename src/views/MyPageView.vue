<script setup></script>
<template>
  <div>MyPageView</div>
  <div>{{ todoStatisticsObj }}</div>
  <div>
    <div>{{ userObj }}</div>
    <button @click="onUpdateUserDetail">정보 변경</button>
    <button @click="onChangePassword">비밀번호 변경</button>
  </div>

  <template v-for="token in tokenObj" :key="token.refreshToken">
    <div>{{ token }}</div>
    <button @click="onRemoteLogout(token.refreshToken)">기기 로그아웃</button>
  </template>

  <!-- update password modal -->
  <ChangePasswordModal v-if="showChangePasswordModal" v-model="showChangePasswordModal" @confirm="refresh" />

  <!-- update user detail modal -->
  <UpdateUserDetailModal v-if="showUpdateUserDetailModal" v-model="showUpdateUserDetailModal" @confirm="refresh" />

  <!-- remtoe logout modal -->
  <RemoteLogoutModal v-if="showRemoteLogoutModal" v-model="showRemoteLogoutModal" @confirm="refresh" :id="activeId" />
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { authApi } from '@/services/authApi';
import { todosApi } from '@/services/todosApi';
import { usersApi } from '@/services/usersApi';
import { toast } from '@/plugins/toast';
import ChangePasswordModal from '@/components/mypage/ChangePasswordModal.vue';
import UpdateUserDetailModal from '@/components/mypage/UpdateUserDetailModal.vue';
import RemoteLogoutModal from '@/components/mypage/RemoteLogoutModal.vue';

const route = useRoute();
const appStore = useAppStore();
const todoStatisticsObj = ref({});
const userObj = ref({});
const tokenObj = ref([]);
const activeId = ref(null);
const showChangePasswordModal = ref(false);
const showUpdateUserDetailModal = ref(false);
const showRemoteLogoutModal = ref(false);

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

onBeforeMount(() => {
  refresh();
});
</script>
