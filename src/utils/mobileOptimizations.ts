// Mobile optimization utilities
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const preventZoom = (): void => {
  // Prevent zoom on input focus for mobile
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta && isMobileDevice()) {
    const currentContent = viewportMeta.getAttribute('content') || '';
    if (!currentContent.includes('user-scalable=no')) {
      viewportMeta.setAttribute('content', currentContent + ', user-scalable=no');
    }
  }
};

export const optimizeForMobile = (): void => {
  if (isMobileDevice()) {
    // Prevent accidental zoom
    preventZoom();
    
    // Add touch-action to body for better scrolling
    document.body.style.touchAction = 'manipulation';
    
    // Prevent overscroll on iOS Safari
    document.body.style.overscrollBehavior = 'none';
    
    // Optimize for mobile viewport
    const html = document.documentElement;
    (html.style as any).webkitTextSizeAdjust = '100%';
    (html.style as any).textSizeAdjust = '100%';
  }
};

// Debounce function for optimizing frequent events
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};