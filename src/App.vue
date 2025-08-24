<template>
  <the-header />

  <router-view />

  <the-footer />

  <TheSpinner />
</template>

<script setup>
import TheHeader from '@/components/_layouts/TheHeader.vue';
import TheFooter from '@/components/_layouts/TheFooter.vue';
import TheSpinner from '@/components/_layouts/TheSpinner.vue';
</script>
