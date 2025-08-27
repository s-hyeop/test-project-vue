<template>
  <div @click="$emit('detail')">
    <div>TodoItem</div>
    <div>{{ todo }}</div>
    <input type="checkbox" :checked="!!todo.completedAt" @change="$emit('toggle', !todo.completedAt)" />
    <button @click="$emit('update')">수정</button>
    <button @click="$emit('delete')">삭제</button>
  </div>
  <hr />
</template>

<script setup>
const props = defineProps({
  todo: { type: Object },
});

const emit = defineEmits(['detail', 'toggle', 'update', 'delete']);
</script>
