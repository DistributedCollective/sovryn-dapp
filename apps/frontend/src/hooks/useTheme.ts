import { useEffect } from "react";
import { AppTheme } from "../types/tailwind";

export const useTheme = () => {
  const handleThemeChange = (theme: AppTheme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    console.log(theme)
    if (theme) {
      handleThemeChange(theme as AppTheme);
    }
  }, []);

  return {
    handleThemeChange,
  };
};
