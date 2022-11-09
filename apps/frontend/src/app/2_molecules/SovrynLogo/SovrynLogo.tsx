import React, { useCallback } from 'react';

import { applyDataAttr, LinkBase } from '@sovryn/ui';

import sovrynLogo from '../../../assets/images/sovryn-logo.svg';

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
  const Logo = useCallback(
    () => (
      <img
        src={image}
        className={className}
        alt={text}
        title={text}
        {...applyDataAttr(dataAttribute)}
      />
    ),
    [className, dataAttribute, image, text],
  );

  return (
    <>
      {link ? (
        <LinkBase href={link} openNewTab={false}>
          <Logo />
        </LinkBase>
      ) : (
        <Logo />
      )}
    </>
  );
};
