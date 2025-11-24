/**
 * SSR 환경에서 안전하게 window 객체를 사용하기 위한 유틸리티
 */

export const isBrowser = typeof window !== 'undefined';

export const safeWindow = {
  get location() {
    return isBrowser ? window.location : null;
  },
  
  get navigator() {
    return isBrowser ? window.navigator : null;
  },
  
  addEventListener: (event: string, handler: EventListener) => {
    if (isBrowser) {
      window.addEventListener(event, handler);
    }
  },
  
  removeEventListener: (event: string, handler: EventListener) => {
    if (isBrowser) {
      window.removeEventListener(event, handler);
    }
  },
  
  dispatchEvent: (event: Event) => {
    if (isBrowser) {
      window.dispatchEvent(event);
    }
  },
  
  open: (url: string, target?: string) => {
    if (isBrowser) {
      window.open(url, target);
    }
  },
  
  reload: () => {
    if (isBrowser) {
      window.location.reload();
    }
  },
  
  redirect: (url: string) => {
    if (isBrowser) {
      window.location.href = url;
    }
  },
};

export default safeWindow;
