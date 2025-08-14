<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {useCenterModalStore} from "@/stores/center-modal.store.ts";
import {useCenterModal} from "@/composables/useCenterModal.ts";
import {AlertModal} from "@/components/UI";

const s = useCenterModalStore();
const { open, title, message, detail, okText, cancelText, showCancel, variant, confirmLoading, _mode } = storeToRefs(useCenterModalStore());

// lấy callback async đã “gửi kèm” trong composable
const cm = useCenterModal();

async function onConfirm() {
  if (_mode.value === 'alert') { s.resolve(); return; }

  // confirm mode
  const cb = (cm.confirm as any)._onConfirm as undefined | (() => void | Promise<void>);
  try {
    if (cb) {
      s.setLoading(true);
      await cb();
    }
    s.resolve(true);
  } catch (e) {
    // không đóng modal nếu callback lỗi — bạn có thể hiện toast ở đây
    console.error(e);
  } finally {
    s.setLoading(false);
  }
}
async function onCancel() {
  const cb = (cm.confirm as any)._onCancel as undefined | (() => void | Promise<void>);
  try {
    if (cb) await cb();
  } finally {
    s.resolve(false);
  }
}
</script>

<template>
  <AlertModal
    :model-value="open"
    :title="title"
    :message="message"
    :detail="detail"
    :ok-text="okText"
    :cancel-text="cancelText"
    :show-cancel="showCancel"
    :variant="variant"
    :confirm-loading="confirmLoading"
    @update:modelValue="v => v ? s.open = true : s.hide()"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>
