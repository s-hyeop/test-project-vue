<template>
  <section class="relative grid min-h-[100svh] place-content-center overflow-hidden">
    <div class="mx-auto w-full max-w-3xl px-6 text-center">
      <div class="hero-card group relative mx-auto rounded-3xl p-8 sm:p-12">
        <h1 class="text-4xl leading-tight font-black tracking-tight text-balance sm:text-6xl">
          <span
            class="animate-[shine_8s_ease-in-out_infinite] bg-gradient-to-r from-red-700 via-rose-400 to-pink-500 [background-size:200%] bg-clip-text text-transparent"
          >
            404 Not Found
          </span>
        </h1>
        <p class="mt-2">페이지를 찾을 수 없습니다.</p>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
          <router-link
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 px-6 py-3 font-semibold text-white shadow-lg ring-1 shadow-violet-900/25 ring-white/10 transition hover:from-rose-400 hover:to-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-[.98]"
            to="/"
          >
            홈으로
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<style scoped>
/* 글래스 카드 + 회전 그라디언트 보더 */
.hero-card {
  background: radial-gradient(
    120% 160% at 50% 0%,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.04)
  );
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px) saturate(120%);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  position: relative;
}
.hero-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: conic-gradient(
    from 180deg,
    rgba(255, 92, 92, 0.65),
    rgba(230, 21, 49, 0.65),
    rgba(230, 89, 48, 0.65),
    rgba(255, 92, 92, 0.65)
  );
  padding: 1px;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  filter: blur(0.6px);
  opacity: 0.55;
  animation: spin 18s linear infinite;
}

@keyframes shine {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
