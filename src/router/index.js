import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import { toast } from '@/plugins/toast';

// Routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/auth',
      name: 'email-check',
      component: () => import('@/views/auth/EmailCheckView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/auth/SignupView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('@/views/TodosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-page',
      name: 'my-page',
      component: () => import('@/views/MyPageView.vue'),
      meta: { requiresAuth: true },
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
});

// filtering
router.beforeEach((to) => {
  const isAuthed = useAuthStore().isAuth;

  if (to.meta.requiresGuest && isAuthed) {
    return { name: 'home' };
  } else if (to.meta.requiresAuth && !isAuthed) {
    toast.info('로그인을 먼저 진행해 주세요.');
    return { name: 'email-check', query: { r: to.fullPath } };
  }
});

export default router;
