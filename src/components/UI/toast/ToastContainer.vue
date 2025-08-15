<template>
  <div>
    <div
      v-for="pos in positions"
      :key="pos"
      class="tc-region"
      :data-pos="pos"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup name="toast-fade" tag="div" class="tc-stack">
        <BaseToast
          v-for="t in listBy(pos)"
          :key="t.id"
          :id="t.id"
          :title="t.title"
          :description="t.description"
          :variant="t.variant"
          :duration="t.duration"
          :dismissible="t.dismissible"
          :actions="t.action"
          @timeout="dismiss(t.id)"
          @dismiss="dismiss(t.id)"
          @action="onAction(t, $event)"
        >
          <component v-if="t.vnode" :is="t.vnode" />
        </BaseToast>
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { toasts, removeToast } from './store';
import BaseToast from './BaseToast.vue';
import type { ToastRecord, ToastPosition } from './types';

const positions: ToastPosition[] = [
  'top-right', 'top-center', 'top-left',
  'bottom-right', 'bottom-center', 'bottom-left',
];

const listBy = (pos: ToastPosition) => toasts.filter(t => t.position === pos);

function dismiss(id: string) {
  removeToast(id);
}

function onAction(t: ToastRecord, a: any) {
  a?.onClick?.(t.id);
}
</script>

<style scoped>
.tc-region { position: fixed; z-index: 9999; pointer-events: none; }
.tc-stack { display: flex; flex-direction: column; gap: 10px; padding: 12px; }

/* Positions */
.tc-region[data-pos="top-right"] { top: 12px; right: 12px; }
.tc-region[data-pos="top-left"] { top: 12px; left: 12px; }
.tc-region[data-pos="bottom-right"] { bottom: 12px; right: 12px; }
.tc-region[data-pos="bottom-left"] { bottom: 12px; left: 12px; }
.tc-region[data-pos="top-center"] { top: 12px; left: 50%; transform: translateX(-50%); }
.tc-region[data-pos="bottom-center"] { bottom: 12px; left: 50%; transform: translateX(-50%); }

/* Enter/leave animations */
.toast-fade-enter-active, .toast-fade-leave-active { transition: all .18s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateY(-6px) scale(.98); }
.toast-fade-leave-to { opacity: 0; transform: translateY(6px) scale(.98); }

/* Allow clicking inside toasts */
.tc-stack :deep(.base-toast) { pointer-events: auto; }
</style>

