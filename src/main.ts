import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import ToastPlugin from '@/components/UI/toast/index';
const app = createApp(App)
app.use(ToastPlugin)

app.use(router)
const pinia = createPinia();
app.use(pinia); // 👈 BẮT BUỘC
app.mount('#app')
