<script setup lang="ts">

import BaseModal from "@/components/UI/modal/BaseModal.vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
  okText?: string;
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

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
      <h3>{{ title || 'Thông báo' }}</h3>
    </template>

    <p>{{ message || 'Đây là một thông báo đơn giản.' }}</p>

    <template #footer>
      <button @click="handleConfirm">
        {{ okText || 'OK' }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #42b983;
  color: white;
  cursor: pointer;
}
</style>
