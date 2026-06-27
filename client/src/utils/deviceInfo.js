export const getBrowser = () => {
  const userAgent = navigator.userAgent;
  if (/chrome|crios|crmo/i.test(userAgent)) return 'Chrome';
  if (/firefox|iceweasel|fxios/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent)) return 'Safari';
  if (/opr\//i.test(userAgent)) return 'Opera';
  if (/edg/i.test(userAgent)) return 'Edge';
  return 'Unknown';
};

export const getOS = () => {
  const platform = navigator.platform || navigator.userAgent;
  if (/mac/i.test(platform)) return 'macOS';
  if (/win/i.test(platform)) return 'Windows';
  if (/linux/i.test(platform)) return 'Linux';
  if (/iphone|ipad|ipod/i.test(platform)) return 'iOS';
  if (/android/i.test(platform)) return 'Android';
  return 'Unknown';
};

export const getViewport = () => {
  return {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };
};

export const getDeviceInfo = () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return {
    browser: getBrowser(),
    os: getOS(),
    ...getViewport(),
    deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    language: navigator.language || navigator.userLanguage,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent: navigator.userAgent,
    referrer: document.referrer || '',
    networkType: navigator.connection?.effectiveType || 'unknown',
    platform: navigator.platform,
    colorScheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    touchDevice: isTouchDevice
  };
};
