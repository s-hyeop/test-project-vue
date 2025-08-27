import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '@/App.vue';
import router from '@/router';
import ToastPlugin from '@/plugins/toast';
import '@/plugins/validation-rules';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ToastPlugin);

app.mount('#app');
