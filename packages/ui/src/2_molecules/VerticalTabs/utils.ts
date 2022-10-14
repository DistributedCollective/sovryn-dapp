const IGNORE_COLORS = ['rgba(0, 0, 0, 0)', 'transparent'];

export const findParentBackgroundColorAndElement = (
  element: HTMLElement,
): [string, Element] => {
  const bg = window
    .getComputedStyle(element)
    .getPropertyValue('background-color');
  if (bg && !IGNORE_COLORS.includes(bg)) {
    return [bg, element];
  }
  if (element.parentElement) {
    return findParentBackgroundColorAndElement(element.parentElement);
  }
  return ['transparent', window.document.body];
};
