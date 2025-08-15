export type ToastID = string;
export type ToastVariant = 'default' | 'success' | 'info' | 'warning' | 'error';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastAction {
  label: string;
  onClick?: (id: ToastID) => void;
}

export interface ToastOptions {
  id?: ToastID;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms; 0 = sticky
  dismissible?: boolean;
  action?: ToastAction | ToastAction[];
  position?: ToastPosition;
  // For custom content/component
  vnode?: import('vue').VNode;
}

export interface ToastRecord extends Required<Omit<ToastOptions, 'vnode'>> {
  vnode?: import('vue').VNode;
}
