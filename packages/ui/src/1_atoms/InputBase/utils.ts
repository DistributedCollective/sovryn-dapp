import { getNumberSeparator } from '../../utils/helpers';

export const prepareValueForEvent = <T = HTMLInputElement>(
  originalEvent: React.ChangeEvent<T>,
  newValue: string,
) => ({
  ...originalEvent,
  target: {
    ...originalEvent.target,
    value: newValue,
  },
  currentTarget: {
    ...originalEvent.currentTarget,
    value: newValue,
  },
});

export const prepareValueToRender = (
  value: string,
  lastValue: string,
  type: string,
  locale: string,
  canEndWithDot: boolean = true,
): string => {
  if (typeof value === 'undefined') {
    return undefined as unknown as string;
  }

  if (type === 'number') {
    const nonNumeric = (value.match(/[^0-9.,]/g) || []).length;
    value = value.replace(/[^0-9.,]/g, '');

    if (value === '' && nonNumeric === 0) {
      return '';
    }

    if (value === '' && nonNumeric > 0) {
      return lastValue;
    }

    // count how much commas and dots are in the value
    const separators = (value.match(/,|\./g) || []).length;
    // if there are more than one comma or dot, use last valid value
    if (separators > 1) {
      return lastValue;
    }

    const renderSeperator = getNumberSeparator(locale);

    if (value.endsWith('.') || value.endsWith(',')) {
      return `${value.slice(0, -1)}${renderSeperator}${
        canEndWithDot ? '' : '0'
      }`;
    }

    if (separators === 1) {
      const [integer, fraction] = value.split(/,|\./);
      if (fraction.length) {
        return `${integer}${renderSeperator}${fraction}`;
      }
    }

    // if value is not a number, use last valid value
    if (isNaN(Number(value))) {
      return lastValue;
    }
  }

  return value;
};

// from string to string, to make sure we don't have any rounding issues.
export const parseBetterFloat = (value: string) => {
  value = value.replace(',', '.');
  if (!value || value.endsWith('.')) {
    value = `${value}0`;
  }

  const separators = (value.match(/,|\./g) || []).length;

  if (separators > 1) {
    return '0';
  }

  if (separators === 1) {
    const [integer, fraction] = value.split(/,|\./);
    if (fraction.length) {
      return `${integer}.${fraction}`;
    }
  }

  return value;
};

// remove trailing zeroes after dot or comma (if there is one)
export const removeTrailingZeroes = (value: string) => {
  if (value.includes('.')) {
    return value.replace(/\.?0+$/, '');
  }
  if (value.includes(',')) {
    return value.replace(/,?0+$/, '');
  }
  return value;
};

export const isIOS = () =>
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !(window as any).MSStream;

export const getIOSInputEventHandlers = () => {
  if (!isIOS()) {
    return {};
  }

  return {
    onTouchStart: e => {
      e.currentTarget.style.fontSize = '1rem';
    },
    onTouchMove: e => {
      e.currentTarget.style.fontSize = '1rem';
    },
    onPointerEnter: e => {
      e.currentTarget.style.fontSize = '1rem';
    },
  };
};
