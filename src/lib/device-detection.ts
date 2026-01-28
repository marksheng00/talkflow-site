/**
 * Unified device detection utilities
 * Consolidates device type and platform detection logic
 */

// ============= Device Type =============

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Detect device type from user agent
 * Used for analytics and responsive behavior
 */
export function getDeviceType(): DeviceType {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

// ============= Platform =============

export type Platform = 'ios' | 'android' | 'desktop';

/**
 * Detect mobile platform from user agent
 * Used for platform-specific features
 */
export function detectPlatform(): Platform | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}
