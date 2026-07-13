import { create } from 'zustand';
import { toFriendlyError } from '../utils/friendlyError';

interface ErrorPopupState {
  visible: boolean;
  title: string;
  message: string;
  /** Optional retry handler — shows a "Try Again" button when set. */
  onRetry: (() => void) | null;
  show: (title: string, message: string, onRetry?: () => void) => void;
  hide: () => void;
}

export const useErrorStore = create<ErrorPopupState>((set) => ({
  visible: false,
  title: '',
  message: '',
  onRetry: null,
  show: (title, message, onRetry) =>
    set({ visible: true, title, message, onRetry: onRetry ?? null }),
  hide: () => set({ visible: false, onRetry: null }),
}));

interface ShowErrorOptions {
  /** Action-specific fallback message, e.g. "We couldn't load your wallet right now." */
  context?: string;
  /** When provided, the popup shows a "Try Again" button that calls this. */
  onRetry?: () => void;
}

/**
 * Show the global user-friendly error popup. Classifies the raw error
 * (network / server / auth / unknown) and never exposes technical
 * messages to the user.
 */
export function showError(error?: unknown, options?: ShowErrorOptions): void {
  const friendly = toFriendlyError(error, options?.context);
  useErrorStore.getState().show(friendly.title, friendly.message, options?.onRetry);
}
