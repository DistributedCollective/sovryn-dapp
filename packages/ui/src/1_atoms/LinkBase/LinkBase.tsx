import React, { FC, PropsWithChildren } from 'react';

import { applyDataAttr } from '../../utils';

export type LinkBaseProps = {
  href: string;
  openNewTab?: boolean;
  className?: string;
  dataAttribute?: string;
  title?: string;
};

export const LinkBase: FC<PropsWithChildren<LinkBaseProps>> = ({
  children,
  href,
  openNewTab = true,
  className,
  title,
  dataAttribute,
}) => (
  <a
    rel="noopener noreferrer"
    href={href}
    target={openNewTab ? '_blank' : undefined}
    className={className}
    title={title}
    {...applyDataAttr(dataAttribute)}
  >
    {children}
  </a>
);
