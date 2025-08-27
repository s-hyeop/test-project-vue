<script setup></script>
<template>
  <div>MyPageView</div>
  <div>
    <div>{{ userObj }}</div>
    <button @click="onUpdateUserDetail">정보 변경</button>
    <button @click="onChangePassword">비밀번호 변경</button>
  </div>

  <!-- update password modal -->
  <ChangePasswordModal v-if="showChangePasswordModal" v-model="showChangePasswordModal" @confirm="refresh" />

  <!-- update user detail modal -->
  <UpdateUserDetailModal v-if="showUpdateUserDetailModal" v-model="showUpdateUserDetailModal" @confirm="refresh" />
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { usersApi } from '@/services/usersApi';
import { toast } from '@/plugins/toast';
import ChangePasswordModal from '@/components/mypage/ChangePasswordModal.vue';
import UpdateUserDetailModal from '@/components/mypage/UpdateUserDetailModal.vue';

const route = useRoute();
const appStore = useAppStore();
const userObj = ref({});
const showChangePasswordModal = ref(false);
const showUpdateUserDetailModal = ref(false);

const refresh = async () => {
  appStore.show('로딩 중...');

  try {
    const res = await usersApi.getUserDetail();
    userObj.value = res.data;
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

onBeforeMount(() => {
  refresh();
});
</script>
