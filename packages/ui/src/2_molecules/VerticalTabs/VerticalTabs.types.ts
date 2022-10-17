import { ReactNode } from 'react';

export type VerticalTabsProps = {
  items: VerticalTabsItemProps[];
  selectedIndex: number;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  onChange?: (index: number) => void;
  header?: (props: VerticalTabsProps) => ReactNode;
  footer?: (props: VerticalTabsProps) => ReactNode;
};

export type VerticalTabsItemProps = {
  label: ReactNode;
  content: ReactNode;
  infoText?: ReactNode;
  disabled?: boolean;
  dataActionId?: string;
};
