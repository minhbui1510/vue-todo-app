<script setup lang="ts">

import BaseModal from "@/components/UI/modal/BaseModal.vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();

const close = () => emit('update:modelValue', false);

const handleConfirm = () => {
  emit('confirm');
  close();
};
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    @update:modelValue="val => emit('update:modelValue', val)"
  >
    <template #header>
      <h3>{{ title || 'Xác nhận hành động' }}</h3>
    </template>

    <div>
      <p>{{ message || 'Bạn có chắc chắn?' }}</p>
    </div>

    <template #footer>
      <button @click="close">{{ cancelText || 'Huỷ' }}</button>
      <button @click="handleConfirm" style="margin-left: 8px">
        {{ confirmText || 'Xác nhận' }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-footer button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-footer button:first-of-type {
  background-color: #ddd;
  color: #333;
}

.modal-footer button:last-of-type {
  background-color: #e74c3c;
  color: white;
}

.modal-footer button:hover {
  opacity: 0.9;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-content p {
  font-size: 14px;
  color: #555;
}

/* Optional fade animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
