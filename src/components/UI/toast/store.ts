import { shallowReactive } from 'vue';
import type { ToastRecord, ToastOptions, ToastID, ToastPosition } from './types';
import { uid } from './utils';

const DEFAULTS: Omit<ToastRecord, 'id'> = {
  title: '',
  description: '',
  variant: 'default',
  duration: 3500,
  dismissible: true,
  action: [],
  position: 'top-right',
};

export const toasts = shallowReactive<ToastRecord[]>([]);

export function addToast(opts: ToastOptions): ToastID {
  const id = opts.id || uid();
  const rec: ToastRecord = {
    id,
    ...DEFAULTS,
    ...opts,
    action: opts.action ? (Array.isArray(opts.action) ? opts.action : [opts.action]) : [],
  };
  toasts.push(rec);
  return id;
}

export function removeToast(id: ToastID) {
  const i = toasts.findIndex(t => t.id === id);
  if (i !== -1) toasts.splice(i, 1);
}

export function clear(position?: ToastPosition) {
  if (!position) {
    toasts.splice(0, toasts.length);
  } else {
    for (let i = toasts.length - 1; i >= 0; i--) {
      if (toasts[i].position === position) toasts.splice(i, 1);
    }
  }
}
