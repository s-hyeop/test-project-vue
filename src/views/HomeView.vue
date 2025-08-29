<template>
  <section class="flex h-screen flex-wrap place-content-center">
    <div class="mx-auto w-full max-w-prose text-center">
      <h1 class="text-4xl font-bold text-white sm:text-5xl">
        <strong class="text-violet-400"> TODO </strong> 체크 리스트
      </h1>

      <div class="mt-4 flex justify-center gap-4 sm:mt-6">
        <router-link
          class="inline-block rounded border border-violet-400 bg-violet-400 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-violet-500"
          v-if="!authStore.isAuth"
          to="/auth"
          >바로 시작</router-link
        >
        <router-link
          class="inline-block rounded border border-violet-400 bg-violet-400 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-violet-500"
          v-if="authStore.isAuth"
          to="/todos"
          >바로 시작</router-link
        >
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>
