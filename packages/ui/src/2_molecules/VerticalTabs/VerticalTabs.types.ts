import { ReactNode } from 'react';

export type VerticalTabsProps = {
  items: VerticalTabsItem[];
  selectedIndex: number;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  onChange?: (index: number) => void;
  header?: (props: VerticalTabsProps) => ReactNode;
  footer?: (props: VerticalTabsProps) => ReactNode;
};

export type VerticalTabsItem = {
  label: ReactNode;
  content: ReactNode;
  infoText?: ReactNode;
  disabled?: boolean;
  dataAttribute?: string;
};

export type VerticalTabsItemButtonProps = VerticalTabsItem & {
  active: boolean;
  onClick: () => void;
};
