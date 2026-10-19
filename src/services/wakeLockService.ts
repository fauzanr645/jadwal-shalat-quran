class WakeLockService {
  private sentinel: any = null;
  private isRequested: boolean = false;

  constructor() {
    // Re-acquire lock if tab becomes visible again
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.isRequested) {
          this.acquire();
        }
      });
    }
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  public async acquire(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      this.isRequested = true;
      if (this.sentinel && !this.sentinel.released) {
        return true;
      }
      this.sentinel = await (navigator as any).wakeLock.request('screen');
      this.sentinel.addEventListener('release', () => {
        this.sentinel = null;
      });
      return true;
    } catch (err) {
      console.warn('Wake Lock acquire failed:', err);
      return false;
    }
  }

  public release() {
    this.isRequested = false;
    if (this.sentinel) {
      this.sentinel.release().catch(() => {});
      this.sentinel = null;
    }
  }

  public isActive(): boolean {
    return !!this.sentinel && !this.sentinel.released;
  }
}

export const wakeLockService = new WakeLockService();
