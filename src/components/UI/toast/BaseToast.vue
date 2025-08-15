<template>
  <div
    class="base-toast"
    :data-variant="variant"
    role="status"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div class="bt-left">
      <slot name="icon">
        <span class="bt-dot" aria-hidden="true" />
      </slot>
    </div>

    <div class="bt-content">
      <div v-if="title" class="bt-title">{{ title }}</div>
      <div v-if="description" class="bt-desc">{{ description }}</div>
      <slot />
      <div v-if="actions.length" class="bt-actions">
        <button
          v-for="(a, idx) in actions"
          :key="idx"
          type="button"
          class="bt-action"
          @click="handleAction(a)"
        >
          {{ a.label }}
        </button>
      </div>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="bt-close"
      aria-label="Dismiss"
      @click="$emit('dismiss')"
    >
      ×
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import type { ToastAction, ToastVariant } from './types';

const props = defineProps<{
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms; 0 sticky
  dismissible?: boolean;
  actions?: ToastAction[];
}>();

const emit = defineEmits<{ (e: 'timeout'): void; (e: 'dismiss'): void; (e: 'action', payload: ToastAction): void }>();

const remaining = ref(props.duration ?? 0);
let startedAt = 0;
let timer: any = null;

const pause = () => {
  if (!remaining.value || !timer) return;
  clearTimeout(timer);
  timer = null;
  remaining.value -= Date.now() - startedAt;
};

const resume = () => {
  if (!remaining.value) return; // sticky or already elapsed
  startedAt = Date.now();
  clearTimeout(timer);
  timer = setTimeout(() => emit('timeout'), remaining.value);
};

onMounted(() => {
  remaining.value = props.duration ?? 0;
  if (remaining.value > 0) resume();
});

onBeforeUnmount(() => clearTimeout(timer));

watch(() => props.duration, (v) => {
  clearTimeout(timer);
  remaining.value = v ?? 0;
  if (remaining.value > 0) resume();
});

function handleAction(a: ToastAction) {
  emit('action', a);
}
</script>

<style scoped>
.base-toast {
  --bg: #111827; /* slate-900 */
  --fg: #f9fafb; /* gray-50 */
  --muted: #d1d5db; /* gray-300 */
  --ring: #6b7280; /* gray-500 */
  --success: #10b981; /* emerald-500 */
  --warning: #f59e0b; /* amber-500 */
  --error: #ef4444; /* red-500 */
  --info: #3b82f6; /* blue-500 */

  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: start;
  width: min(440px, 94vw);
  padding: 12px 12px 12px 10px;
  border-radius: 14px;
  background: var(--bg);
  color: var(--fg);
  box-shadow: 0 10px 30px rgba(0,0,0,.3);
  border: 1px solid rgba(255,255,255,.06);
}
.base-toast[data-variant="success"] { border-left: 4px solid var(--success); }
.base-toast[data-variant="warning"] { border-left: 4px solid var(--warning); }
.base-toast[data-variant="error"] { border-left: 4px solid var(--error); }
.base-toast[data-variant="info"] { border-left: 4px solid var(--info); }

.bt-left { padding-top: 3px; }
.bt-dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; background: var(--ring); }
.base-toast[data-variant="success"] .bt-dot { background: var(--success); }
.base-toast[data-variant="warning"] .bt-dot { background: var(--warning); }
.base-toast[data-variant="error"] .bt-dot { background: var(--error); }
.base-toast[data-variant="info"] .bt-dot { background: var(--info); }

.bt-title { font-weight: 700; line-height: 1.2; }
.bt-desc { color: var(--muted); margin-top: 2px; line-height: 1.4; }
.bt-actions { margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap; }
.bt-action {
  background: transparent; color: var(--fg); border: 1px solid rgba(255,255,255,.2);
  padding: 6px 10px; border-radius: 10px; cursor: pointer;
}
.bt-action:hover { background: rgba(255,255,255,.06); }

.bt-close { background: transparent; color: var(--muted); border: none; font-size: 18px; cursor: pointer; padding: 0 4px; }
.bt-close:hover { color: var(--fg); }
</style>
