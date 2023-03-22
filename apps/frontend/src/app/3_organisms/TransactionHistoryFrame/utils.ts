export const renderSign = (value: string) => {
  if (value === '0') {
    return '';
  }
  return value.startsWith('-') ? '' : '+';
};
