import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useTodosStore = defineStore('todos', () => {
  todos = reactive([]);

  return {
    todos,
  };
});
