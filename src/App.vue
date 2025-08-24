<script setup>
import TheHeader from './components/_layouts/TheHeader.vue'
import TheFooter from './components/_layouts/TheFooter.vue'
</script>

<template>
  <the-header />

  <router-view />

  <the-footer />
</template>
