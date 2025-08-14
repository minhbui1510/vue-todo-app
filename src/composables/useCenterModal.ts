import { useCenterModalStore, type CenterVariant } from '@/stores/center-modal.store';

export type BaseOptions = {
  title?: string;
  message?: string;
  detail?: string;
  okText?: string;
  cancelText?: string;
  variant?: CenterVariant;
  showCancel?: boolean;
};

export type ConfirmOptions = BaseOptions & {
  // có thể trả về promise để block nút OK
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

export function useCenterModal() {
  const s = useCenterModalStore();

  function alert(options: BaseOptions): Promise<void> {
    return new Promise<void>((resolve) => {
      const variant: CenterVariant = options.variant ?? 'info';
      s.show({
        _mode: 'alert',
        variant,
        title: options.title ?? (variant === 'success' ? 'Thành công' : 'Thông báo'),
        message: options.message,
        detail: options.detail,
        okText: options.okText ?? 'OK',
        showCancel: false,
        _resolver: () => resolve(),
      });
    });
  }

  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const variant: CenterVariant = options.variant ?? 'confirm';
      s.show({
        _mode: 'confirm',
        variant,
        title: options.title ?? (variant === 'danger' ? 'Nguy hiểm' : variant === 'warning' ? 'Cảnh báo' : 'Xác nhận'),
        message: options.message,
        detail: options.detail,
        okText: options.okText ?? (variant === 'danger' ? 'Xác nhận' : 'Đồng ý'),
        cancelText: options.cancelText ?? 'Hủy',
        showCancel: options.showCancel ?? true,
        _resolver: (v?: boolean) => resolve(Boolean(v)),
      });

      // “điều phối” callback async cho presenter dùng
      (confirm as any)._onConfirm = options.onConfirm;
      (confirm as any)._onCancel = options.onCancel;
    });
  }

  // sugar helpers
  const success = (msg: string | BaseOptions) =>
    alert(typeof msg === 'string' ? { message: msg, variant: 'success' } : { ...msg, variant: 'success' });

  const warning = (opts: ConfirmOptions) => confirm({ ...opts, variant: 'warning' });
  const danger  = (opts: ConfirmOptions) => confirm({ ...opts, variant: 'danger'  });

  const error = (msgOrOpts: string | BaseOptions) =>
    alert(typeof msgOrOpts === 'string' ? { message: msgOrOpts, variant: 'danger' } : { ...msgOrOpts, variant: 'danger' });

  function close() { s.hide(); }

  return { alert, confirm, success, warning, danger, error, close, _store: s };
}
