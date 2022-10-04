export enum DropdownMode {
  left = 'left',
  right = 'right',
  center = 'center',
  sameWidth = 'sameWidth',
}

export enum DropdownSize {
  large = 'large',
  small = 'small',
}

export type DropdownCoords = {
  top: number;
  left: number;
  right: number;
  buttonWidth: number;
  windowWidth: number;
  dropdownWidth: number;
};
