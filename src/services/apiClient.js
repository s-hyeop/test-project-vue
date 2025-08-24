import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.axios = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.refreshPromise = null;
    this.initInterceptors();
  }

  initInterceptors() {
    this.axios.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore();
        if (authStore.accessToken?.value && !config.skipAuth) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${authStore.accessToken.value}`;
        }
        return config;
      },

      (error) => {
        return Promise.reject(error);
      },
    );

    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest.skipAuth &&
          !originalRequest._retry
        ) {
          const authStore = useAuthStore();
          originalRequest._retry = true;

          try {
            if (!this.refreshPromise) {
              this.refreshPromise = this.axios
                .post('/tokens/refresh', null, { skipAuth: true })
                .then((res) => {
                  return res.data.token;
                })
                .finally(() => {
                  this.refreshPromise = null;
                });
            }

            // 토큰 재발급
            const newToken = await this.refreshPromise;

            // 토큰 재 반영
            authStore.setToken(newToken);

            // 다시 요청
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${authStore.accessToken.value}`;

            // 재실행 결과 반환
            return this.axios(originalRequest);
          } catch (refreshError) {
            // 토큰 제거 후 로그인 페이지로 이동
            authStore.removeToken();
            window.location.assign('/login');
            return Promise.reject(refreshError);
          }
        }

        const errorMessage = error.response?.data?.message || 'API 요청에 실패했습니다.';
        return Promise.reject(
          Object.assign(new Error(errorMessage), {
            status: error.response?.status,
            data: error.response?.data,
          }),
        );
      },
    );
  }

  get(endpoint, options = {}) {
    return this.axios.get(endpoint, options);
  }

  post(endpoint, data, options = {}) {
    return this.axios.post(endpoint, data, options);
  }

  put(endpoint, data, options = {}) {
    return this.axios.put(endpoint, data, options);
  }

  patch(endpoint, data, options = {}) {
    return this.axios.patch(endpoint, data, options);
  }

  delete(endpoint, options = {}) {
    return this.axios.delete(endpoint, options);
  }
}

export const apiClient = new ApiClient();
