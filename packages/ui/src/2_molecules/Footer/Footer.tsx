import React, { FC, ReactNode } from 'react';

import { applyDataAttr } from '../../utils';
import styles from './Footer.module.css';

type FooterProps = {
  dataAttribute?: string;
  leftContent?: ReactNode;
  links?: ReactNode;
  rightContent?: ReactNode;
};

export const Footer: FC<FooterProps> = ({
  dataAttribute,
  leftContent,
  links,
  rightContent,
}) => (
  <footer {...applyDataAttr(dataAttribute)} className={styles.footer}>
    <div className={styles.leftContent}>
      {leftContent}
      <div className={styles.links}>{links}</div>
    </div>
    <div className={styles.rightContent}>{rightContent}</div>
  </footer>
);
