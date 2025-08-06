// composables/showModal.ts
import { createApp, h } from 'vue';
import {AlertModal, ConfirmModal, WarningModal} from "@/components/UI";

/**
 * Generic helper to show any modal and return a Promise<boolean>
 */
function createModal(Component: any, props: any): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const app = createApp({
      render() {
        return h(Component, {
          ...props,
          modelValue: true,
          'onUpdate:modelValue': (val: boolean) => {
            if (!val) cleanup();
          },
          onConfirm: () => {
            resolve(true);
            cleanup();
          },
          onCancel: () => {
            resolve(false);
            cleanup();
          }
        });
      }
    });

    const cleanup = () => {
      app.unmount();
      document.body.removeChild(container);
    };

    app.mount(container);
  });
}

/**
 * Hiển thị modal thông báo đơn giản với nút OK
 */
export function showAlert({
  title = 'Thông báo',
  message = '',
  okText = 'OK'
}: {
  title?: string;
  message: string;
  okText?: string;
}): Promise<boolean> {
  return createModal(AlertModal, { title, message, okText });
}

/**
 * Hiển thị modal xác nhận với nút Xác nhận / Huỷ
 */
export function showConfirm({
  title = 'Xác nhận',
  message = '',
  confirmText = 'Xác nhận',
  cancelText = 'Huỷ'
}: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<boolean> {
  return createModal(ConfirmModal, { title, message, confirmText, cancelText });
}

/**
 * Hiển thị modal cảnh báo quan trọng (màu cam)
 */
export function showWarning({
  title = 'Cảnh báo',
  message = '',
  confirmText = 'Tôi hiểu',
  cancelText = 'Huỷ'
}: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<boolean> {
  return createModal(WarningModal, { title, message, confirmText, cancelText });
}
