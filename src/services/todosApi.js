import { apiClient } from './apiClient.js';

export const todosApi = {
  getTodos: (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/todos?${searchParams.toString()}`);
  },

  getTodo: (todoId) => apiClient.get(`/todos/${todoId}`),

  createTodo: (title, content, color, dueAt) => apiClient.post('/todos', { title, content, color, dueAt }),

  updateTodo: (todoId, title, content, color, dueAt, sequence) => apiClient.put(`/todos/${todoId}`, { title, content, color, dueAt, sequence }),

  patchTodo: (todoId, completed) => apiClient.patch(`/todos/${todoId}`, { completed }),

  deleteTodo: (todoId) => apiClient.delete(`/todos/${todoId}`),

  getTodoStatistics: () => apiClient.get('/todos/statistics'),
};
