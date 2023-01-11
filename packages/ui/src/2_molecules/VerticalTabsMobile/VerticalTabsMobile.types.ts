import { ReactNode } from 'react';

export type VerticalTabsMobileProps = {
  items: VerticalTabsMobileItem[];
  selectedIndex?: number | null;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  onChange?: (index: number | null) => void;
  header?: (props: VerticalTabsMobileProps) => ReactNode;
};

export type VerticalTabsMobileItem = {
  label: ReactNode;
  content: ReactNode;
  infoText?: ReactNode;
  disabled?: boolean;
  dataAttribute?: string;
};

export type VerticalTabMobileItemButtonProps = VerticalTabsMobileItem & {
  onClick: () => void;
};
