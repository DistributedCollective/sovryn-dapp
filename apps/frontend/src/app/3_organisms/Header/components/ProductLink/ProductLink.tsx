import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { ReactComponent as ExitApp } from '../../../../../assets/images/exit-app-icon.svg';
import styles from './ProductLink.module.css';

type ProductLinkProps = {
  label: ReactNode;
  description?: ReactNode;
  href: string;
};

export const ProductLink: FC<ProductLinkProps> = ({
  label,
  description,
  href,
}) => (
  <li className="pl-4 lg:pl-0">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames(styles.link, 'flex flex-col')}
    >
      <Paragraph className="lg:font-bold lg:mb-1 text-sm">{label}</Paragraph>
      <div className="w-full justify-between items-top gap-x-2 hidden lg:flex">
        <Paragraph size={ParagraphSize.small}>{description}</Paragraph>
        <ExitApp className="w-4 h-4 flex-grow-0 flex-shrink-0 bg-sovryn-black" />
      </div>
    </a>
  </li>
);
