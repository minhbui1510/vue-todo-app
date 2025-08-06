<!-- components/shared/BaseModal.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const close = () => emit('update:modelValue', false);

const onEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
};

onMounted(() => document.addEventListener('keydown', onEsc));
onBeforeUnmount(() => document.removeEventListener('keydown', onEsc));
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <header class="modal-header">
            <slot name="header">
              <h3>Modal</h3>
            </slot>
            <button class="close-button" @click="close">×</button>
          </header>

          <div class="modal-body">
            <slot />
          </div>

          <footer class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  padding: 20px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 10px;
}

.modal-footer {
  margin-top: 20px;
  text-align: right;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
