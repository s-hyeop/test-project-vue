<template>
  <TheBackgroundOrbs />
  <TheHeader />
  <RouterView />
  <TheSpinner />
</template>

<script setup>
import TheBackgroundOrbs from '@/components/_layouts/TheBackgroundOrbs.vue';
import TheHeader from '@/components/_layouts/TheHeader.vue';
import TheSpinner from '@/components/_layouts/TheSpinner.vue';
</script>
