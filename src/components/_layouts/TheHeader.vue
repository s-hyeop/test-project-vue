<template>
  <header class="bg-black/30">
    <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex-1 md:flex md:items-center md:gap-12">
          <Router-Link class="block text-lg font-bold text-violet-300 hover:text-violet-400" to="/"
            >TODO</Router-Link
          >
        </div>

        <div class="md:flex md:items-center md:gap-12">
          <nav aria-label="Global" class="block">
            <ul class="flex items-center gap-3 text-sm">
              <li v-if="!authStore.isAuth">
                <Router-Link class="text-white transition hover:text-white/75" to="/auth">
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
                    class="lucide lucide-circle-user-icon lucide-circle-user"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                </Router-Link>
              </li>
              <li v-if="authStore.isAuth">
                <Router-Link class="text-white transition hover:text-white/75" to="/todos">
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
                    class="lucide lucide-list-checks-icon lucide-list-checks"
                  >
                    <path d="m3 17 2 2 4-4" />
                    <path d="m3 7 2 2 4-4" />
                    <path d="M13 6h8" />
                    <path d="M13 12h8" />
                    <path d="M13 18h8" />
                  </svg>
                </Router-Link>
              </li>
              <li v-if="authStore.isAuth">
                <Router-Link class="text-white transition hover:text-white/75" to="/my-page">
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
                    class="lucide lucide-circle-user-icon lucide-circle-user"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                </Router-Link>
              </li>
              <li v-if="authStore.isAuth">
                <Router-Link
                  class="text-white transition hover:text-white/75"
                  to="#"
                  @click="onLogout"
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
                    class="lucide lucide-log-out-icon lucide-log-out"
                  >
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                </Router-Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/services/authApi';
import { toast } from '@/plugins/toast';

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

// ==================================================

const onLogout = async () => {
  appStore.show('로그아웃 중...');

  try {
    await authApi.deleteCurrentToken();
    authStore.removeToken();
    toast.warning('로그아웃이 완료되었습니다.');
    router.push({ name: 'home' });
  } catch (e) {
    toast.error(e.message);
  } finally {
    appStore.hidden();
  }
};
</script>
