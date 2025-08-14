<!-- src/components/UI/modal/AlertModal.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '@/components/UI/modal/BaseModal.vue';

type Variant = 'info' | 'success' | 'warning' | 'danger' | 'confirm';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
  detail?: string;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  variant?: Variant;
  confirmLoading?: boolean;
  autoCloseOnConfirm?: boolean;
}>(), {
  variant: 'info',
  confirmLoading: false,
  autoCloseOnConfirm: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'confirm'): void | Promise<void>;
  (e: 'cancel'): void;
}>();

const defaults = computed(() => {
  switch (props.variant) {
    case 'success': return { title: 'Thành công', ok: 'OK',       cancel: undefined, showCancel: false };
    case 'warning': return { title: 'Cảnh báo',   ok: 'Tiếp tục', cancel: 'Hủy',     showCancel: true  };
    case 'danger':  return { title: 'Nguy hiểm',  ok: 'Xác nhận', cancel: 'Hủy',     showCancel: true  };
    case 'confirm': return { title: 'Xác nhận',   ok: 'Đồng ý',   cancel: 'Hủy',     showCancel: true  };
    default:        return { title: 'Thông báo',  ok: 'OK',       cancel: undefined, showCancel: false };
  }
});

const title = computed(() => props.title ?? defaults.value.title);
const okText = computed(() => props.okText ?? defaults.value.ok);
const cancelText = computed(() => props.cancelText ?? defaults.value.cancel);
const showCancel = computed(() => props.showCancel ?? defaults.value.showCancel);

function close(v = false) { emit('update:modelValue', v); }
function onCancel() { emit('cancel'); close(false); }
function onConfirm() {
  emit('confirm');
  if (props.autoCloseOnConfirm && !props.confirmLoading) close(false);
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    @update:modelValue="v => close(v)"
  >
    <!-- HEADER: phải là con trực tiếp của BaseModal -->
    <template #header>
      <h3>{{ title }}</h3>
    </template>

    <!-- DEFAULT SLOT: bọc class để ăn SCSS global đã export -->
    <div class="alert-modal">
      <slot>
        <p v-if="message">{{ message }}</p>
        <pre v-if="detail" class="alert-modal__detail">{{ detail }}</pre>
      </slot>
    </div>

    <!-- FOOTER: phải là con trực tiếp của BaseModal -->
    <template #footer>
      <div class="alert-modal__actions">
        <button
          v-if="showCancel"
          type="button"
          class="am-btn am-btn--ghost"
          @click="onCancel"
          :disabled="confirmLoading"
        >
          {{ cancelText || 'Hủy' }}
        </button>

        <button
          type="button"
          class="am-btn am-btn--primary"
          :data-variant="variant"
          @click="onConfirm"
          :disabled="confirmLoading"
        >
          <span v-if="confirmLoading" class="am-spinner" aria-hidden="true" />
          <span>{{ okText || 'OK' }}</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>
