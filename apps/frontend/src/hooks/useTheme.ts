import { useCallback, useEffect } from 'react';

import { AppTheme } from '../types/tailwind';

export const useTheme = () => {
  const handleThemeChange = useCallback((theme: AppTheme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      handleThemeChange(theme as AppTheme);
    }
  }, [handleThemeChange]);

  return {
    handleThemeChange,
  };
};
