import { createApp, h, type App, type VNode } from 'vue';
import ToastContainer from './ToastContainer.vue';
import { addToast, clear } from './store';
import type { ToastOptions, ToastVariant, ToastPosition } from './types';

let mounted = false;
function ensureMounted() {
  if (mounted) return;
  if (typeof document === 'undefined') return; // SSR safeguard
  const host = document.createElement('div');
  host.id = 'vue-toast-host';
  document.body.appendChild(host);
  const app = createApp({ render: () => h(ToastContainer) });
  app.mount(host);
  mounted = true;
}

export function show(opts: ToastOptions) {
  ensureMounted();
  return addToast(opts);
}

export function make(variant: ToastVariant) {
  return (titleOrDesc: string, opts: Omit<ToastOptions, 'variant' | 'title' | 'description'> = {}) =>
    show({ variant, title: '', description: titleOrDesc, ...opts });
}

export const toast = Object.assign(show, {
  success: make('success'),
  info: make('info'),
  warning: make('warning'),
  error: make('error'),
  default: make('default'),
  custom(vnode: VNode, opts: Omit<ToastOptions, 'vnode'> = {}) {
    return show({ ...opts, vnode });
  },
  clear(position?: ToastPosition) { clear(position); },
});

export default {
  install(app: App) {
    ensureMounted();
    app.config.globalProperties.$toast = toast;
  }
};

// Types for global this.$toast in TS projects
declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: typeof toast;
  }
}
