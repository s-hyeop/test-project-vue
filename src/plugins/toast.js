import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const ToastPlugin = {
  install(app, options = {}) {
    app.use(Vue3Toastify, {
      autoClose: 3000,
      position: 'bottom-right',
      theme: 'light',
      clearOnUrlChange: false,
      ...options,
    });
    app.config.globalProperties.$toast = toast;
    app.provide('toast', toast);
  },
};

export default ToastPlugin;
export { toast };
