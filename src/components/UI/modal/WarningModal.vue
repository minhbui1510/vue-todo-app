<script setup lang="ts">
import BaseModal from './BaseModal.vue';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const close = () => emit('update:modelValue', false);

const handleConfirm = () => {
  emit('confirm');
  close();
};
const handleCancel = () => {
  emit('cancel');
  close();
};
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    @update:modelValue="val => emit('update:modelValue', val)"
  >
    <template #header>
      <h3 style="color: #d35400">⚠️ {{ title || 'Cảnh báo' }}</h3>
    </template>

    <p>{{ message || 'Hành động này có thể gây ảnh hưởng!' }}</p>

    <template #footer>
      <button class="cancel-btn" @click="handleCancel">
        {{ cancelText || 'Huỷ' }}
      </button>
      <button class="confirm-btn" @click="handleConfirm">
        {{ confirmText || 'Tôi hiểu' }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.confirm-btn {
  background: #e67e22;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
}
.cancel-btn {
  background: #ccc;
  color: #333;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  margin-right: 8px;
}
</style>
