import React, { useMemo } from 'react';

import { Link, To } from 'react-router-dom';

import { applyDataAttr } from '@sovryn/ui';

import sovrynLogo from '../../../assets/images/sovryn-logo.svg';
import styles from './SovrynLogo.module.css';

type SovrynLogoProps = {
  image?: string;
  text?: string;
  link?: To;
  dataAttribute?: string;
  className?: string;
  onClick?: () => void;
};

export const SovrynLogo: React.FC<SovrynLogoProps> = ({
  image = sovrynLogo,
  text,
  link,
  dataAttribute,
  className,
  onClick,
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
        <Link to={link} className={styles.link} onClick={onClick}>
          {Logo}
        </Link>
      ) : (
        <>{Logo}</>
      )}
    </>
  );
};
