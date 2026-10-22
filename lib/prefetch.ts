/**
 * Network-aware prefetch guard.
 * Checks for user's explicit Data-Saver settings and slow cellular networks
 * before initiating route prefetching.
 */
const prefetchedUrls = new Set<string>();

export function shouldPrefetch(url?: string): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  // Avoid duplicate prefetch calls
  if (url && prefetchedUrls.has(url)) {
    return false;
  }

  // Respect user's explicit Save-Data header/setting
  const nav = navigator as unknown as {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
    };
  };

  if (nav.connection?.saveData) {
    return false;
  }

  // Avoid prefetching on slow cellular networks
  if (
    nav.connection?.effectiveType === "slow-2g" ||
    nav.connection?.effectiveType === "2g"
  ) {
    return false;
  }

  if (url) {
    prefetchedUrls.add(url);
  }

  return true;
}
