import { useState, useEffect, useCallback } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@sovryn/tailwindcss-config';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  const getPlatformType = useCallback(() => {
    const config = resolveConfig(tailwindConfig);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const widthToCheck: string = config?.theme?.screens.md; // value will be in format "768px"
    const screenWidth = window?.visualViewport?.width || 0;
    return screenWidth < parseInt(widthToCheck || '0')
      ? setIsMobile(true)
      : setIsMobile(false);
  }, []);

  useEffect(() => {
    getPlatformType();
    window.addEventListener('resize', getPlatformType);

    return () => {
      window.removeEventListener('resize', getPlatformType);
    };
  }, [getPlatformType]);

  return { isMobile };
}
