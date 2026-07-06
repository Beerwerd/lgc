import { useEffect, useState } from 'react';

export type PlatformKind = 'desktop' | 'mobile';

export type PlatformRecognition = {
  kind: PlatformKind;
  isDesktop: boolean;
  isMobile: boolean;
};

const mobileUserAgentPattern =
  /Android|BlackBerry|iPhone|iPad|iPod|IEMobile|Mobile|Opera Mini/i;

const desktopRecognition: PlatformRecognition = {
  kind: 'desktop',
  isDesktop: true,
  isMobile: false,
};

const mobileRecognition: PlatformRecognition = {
  kind: 'mobile',
  isDesktop: false,
  isMobile: true,
};

const getPlatformRecognition = (): PlatformRecognition => {
  if (typeof window === 'undefined') {
    return desktopRecognition;
  }

  const hasMobileUserAgent = mobileUserAgentPattern.test(window.navigator.userAgent);
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const cannotHover = window.matchMedia('(hover: none)').matches;
  const hasSmallViewport = window.innerWidth < 760;
  const isMobile = hasMobileUserAgent || (hasCoarsePointer && (cannotHover || hasSmallViewport));

  return isMobile ? mobileRecognition : desktopRecognition;
};

export function usePlatformRecognition() {
  const [platformRecognition, setPlatformRecognition] = useState(getPlatformRecognition);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const hoverQuery = window.matchMedia('(hover: none)');

    const updatePlatformRecognition = () => {
      setPlatformRecognition(getPlatformRecognition());
    };

    pointerQuery.addEventListener('change', updatePlatformRecognition);
    hoverQuery.addEventListener('change', updatePlatformRecognition);
    window.addEventListener('resize', updatePlatformRecognition);
    window.addEventListener('orientationchange', updatePlatformRecognition);

    return () => {
      pointerQuery.removeEventListener('change', updatePlatformRecognition);
      hoverQuery.removeEventListener('change', updatePlatformRecognition);
      window.removeEventListener('resize', updatePlatformRecognition);
      window.removeEventListener('orientationchange', updatePlatformRecognition);
    };
  }, []);

  return platformRecognition;
}
