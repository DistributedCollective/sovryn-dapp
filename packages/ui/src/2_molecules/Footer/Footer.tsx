import React, { FC, ReactNode } from 'react';

import { applyDataAttr } from '../../utils';
import styles from './Footer.module.css';

type FooterProps = {
  dataLayoutId?: string;
  leftContent?: ReactNode;
  links?: ReactNode;
  rightContent?: ReactNode;
};

export const Footer: FC<FooterProps> = ({
  dataLayoutId,
  leftContent,
  links,
  rightContent,
}) => (
  <footer {...applyDataAttr(dataLayoutId)} className={styles.footer}>
    <div className={styles.leftContent}>
      {leftContent}
      <div className={styles.links}>{links}</div>
    </div>
    <div className={styles.rightContent}>{rightContent}</div>
  </footer>
);
