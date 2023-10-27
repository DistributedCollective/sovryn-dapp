export const getNumberSeparator = (locale: string = navigator.language) =>
  (0.1).toLocaleString(locale).replace(/\d/g, '');
