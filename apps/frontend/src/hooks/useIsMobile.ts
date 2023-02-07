import { useState, useEffect, useCallback } from 'react';

import { isMobileDevice } from '../utils/helpers';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(isMobileDevice);

  const checkIsMobile = useCallback(
    () => setIsMobile(isMobileDevice),
    [setIsMobile],
  );

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [checkIsMobile]);

  return { isMobile };
}
