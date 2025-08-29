<template>
  <section class="lg:grid lg:h-screen lg:place-content-center">
    <div class="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div class="mx-auto max-w-prose text-center">
        <h1 class="text-4xl font-bold text-white sm:text-5xl"><strong class="text-violet-400"> TODO </strong> 체크 리스트</h1>

        <div class="mt-4 flex justify-center gap-4 sm:mt-6">
          <router-link class="inline-block rounded border border-violet-400 bg-violet-400 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-violet-500" v-if="!authStore.isAuth" to="/auth">바로 시작</router-link>
          <router-link class="inline-block rounded border border-violet-400 bg-violet-400 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-violet-500" v-if="authStore.isAuth" to="/todos">바로 시작</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>
