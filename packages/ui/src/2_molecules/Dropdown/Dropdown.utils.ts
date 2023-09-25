import { DropdownCoords, DropdownMode } from './Dropdown.types';

const safeLeftPosition = (left: number, maxWidth: number) => {
  if (left < 0) {
    return 0;
  }
  if (left + maxWidth > window.innerWidth) {
    const newLeft = window.innerWidth - maxWidth;
    return newLeft > 16 ? newLeft - 16 : newLeft;
  }
  return left;
};

export const getDropdownPositionStyles = (
  coords: DropdownCoords,
  mode: DropdownMode,
) => {
  const { top, left, right, buttonWidth, windowWidth, dropdownWidth } = coords;

  //getting the max width for the dropdown according to the button width
  // and to prevent it from going out of the screen
  const rightButtonOffset = windowWidth - (left + buttonWidth);
  let maxCenterWidthDropdown: number;

  if (rightButtonOffset > left) {
    maxCenterWidthDropdown = left * 2 + buttonWidth;
  } else if (rightButtonOffset < left) {
    maxCenterWidthDropdown = right * 2 + buttonWidth;
  } else {
    maxCenterWidthDropdown = windowWidth;
  }

  const centerWidthDropdown =
    dropdownWidth > maxCenterWidthDropdown
      ? maxCenterWidthDropdown
      : dropdownWidth;

  const DropdownPosition = {
    left: {
      left: `${safeLeftPosition(left, dropdownWidth)}px`,
      maxWidth: `${windowWidth - left}px`,
    },
    right: {
      left: `${safeLeftPosition(left + buttonWidth, dropdownWidth)}px`,
      maxWidth: `${left + buttonWidth}px`,
      transform: 'translateX(-100%)',
    },
    center: {
      left: `${safeLeftPosition(
        left - (centerWidthDropdown - buttonWidth) / 2,
        dropdownWidth,
      )}px`,
      maxWidth: `${maxCenterWidthDropdown}px`,
    },
    sameWidth: {
      left: `${safeLeftPosition(left, dropdownWidth)}px`,
      minWidth: `${buttonWidth}px`,
      width: `auto`,
    },
  };

  const DropdownPositionTop = {
    top: `${top}px`,
  };

  const DropdownPositionStyles = {
    ...DropdownPosition[mode],
    ...DropdownPositionTop,
  };
  return DropdownPositionStyles;
};
