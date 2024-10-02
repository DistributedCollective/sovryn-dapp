import { useState, useEffect } from 'react';

export const useLoadChartingLibrary = () => {
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  useEffect(() => {
    const loadLibrary = async () => {
      if (window.TradingView && window.TradingView.widget) {
        setIsLibraryLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = '/charting_library/charting_library.min.js';
      script.onload = () => setIsLibraryLoaded(true);
      script.onerror = () =>
        console.error('Failed to load charting library script');
      document.body.appendChild(script);
    };

    loadLibrary();
  }, []);

  return { isLibraryLoaded };
};
