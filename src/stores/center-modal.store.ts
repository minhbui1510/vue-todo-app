// src/stores/center-modal.store.ts
import { defineStore } from 'pinia';

export type CenterVariant = 'info' | 'success' | 'warning' | 'danger' | 'confirm';

export type CenterModalState = {
  // modal
  open: boolean;
  title: string;
  message: string;
  detail: string;
  variant: CenterVariant;
  okText: string;
  cancelText: string;
  showCancel: boolean;
  confirmLoading: boolean;
  _resolver?: (v?: boolean) => void;
  _mode: 'alert' | 'confirm';

  // GLOBAL LOADING
  loading: boolean;          // có hiển thị overlay không
  loadingText: string;       // text hiển thị trên overlay
  _loadingCount: number;     // đếm request đồng thời để tránh tắt sớm
};

export const useCenterModalStore = defineStore('center-modal', {
  state: (): CenterModalState => ({
    // modal defaults
    open: false,
    title: '',
    message: '',
    detail: '',
    variant: 'info',
    okText: '',
    cancelText: '',
    showCancel: false,
    confirmLoading: false,
    _resolver: undefined,
    _mode: 'alert',

    // loading defaults
    loading: false,
    loadingText: 'Đang xử lý…',
    _loadingCount: 0,
  }),
  actions: {
    // ===== Modal =====
    show(payload: Partial<CenterModalState>) {
      Object.assign(this, payload);
      this.open = true;
    },
    hide() {
      this.open = false;
      this.confirmLoading = false;
      this._resolver = undefined;
    },
    resolve(v?: boolean) { this._resolver?.(v); this.hide(); },
    setLoading(v: boolean) { this.confirmLoading = v; },

    // ===== Global Loading Overlay =====
    startLoading(text?: string) {
      this._loadingCount++;
      if (text) this.loadingText = text;
      this.loading = true;
    },
    stopLoading() {
      this._loadingCount = Math.max(0, this._loadingCount - 1);
      if (this._loadingCount === 0) this.loading = false;
    },
    resetLoading() {
      this._loadingCount = 0;
      this.loading = false;
      this.loadingText = 'Đang xử lý…';
    },
  },
});
