import React, { useMemo } from 'react';

import { applyDataAttr, LinkBase } from '@sovryn/ui';

import sovrynLogo from '../../../assets/images/sovryn-logo.svg';
import styles from './SovrynLogo.module.css';

type SovrynLogoProps = {
  image?: string;
  text?: string;
  link?: string;
  dataAttribute?: string;
  className?: string;
};

export const SovrynLogo: React.FC<SovrynLogoProps> = ({
  image = sovrynLogo,
  text,
  link,
  dataAttribute,
  className,
}) => {
  const Logo = useMemo(
    () => (
      <div className={styles.logo}>
        <img
          src={image}
          className={className}
          alt={text}
          title={text}
          {...applyDataAttr(dataAttribute)}
        />{' '}
        {text}
      </div>
    ),
    [className, dataAttribute, image, text],
  );

  return (
    <>
      {link ? (
        <LinkBase href={link} openNewTab={false} className={styles.link}>
          {Logo}
        </LinkBase>
      ) : (
        <>{Logo}</>
      )}
    </>
  );
};
