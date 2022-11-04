import React, { FC } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { applyDataAttr, Icon } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { sovrynLinks } from '../../../utils/constants';
import styles from './SocialLinks.module.css';

export type SocialLinksProps = {
  className?: string;
  innerClassName?: string;
  dataAttributeId?: string;
};

const socials = [
  {
    id: 'discord',
    icon: 'discord-logo',
    url: sovrynLinks.discord,
  },
  {
    id: 'telegram',
    icon: 'telegram-logo',
    url: sovrynLinks.telegram,
  },
  {
    id: 'twitter',
    icon: 'twitter-logo',
    url: sovrynLinks.twitter,
  },
  {
    id: 'github',
    icon: 'github-logo',
    url: sovrynLinks.github,
  },
];

export const SocialLinks: FC<SocialLinksProps> = ({
  className,
  innerClassName,
  dataAttributeId,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(styles.socials, className)}
      {...applyDataAttr(dataAttributeId)}
    >
      {socials.map(item => (
        <a
          href={item.url}
          className={classNames(styles.container, innerClassName)}
          target="_blank"
          rel="noopener noreferrer"
          title={t(translations.common.socials[item.id])}
          key={item.id}
          {...applyDataAttr(`${dataAttributeId}-${item.id}`)}
        >
          <div className={styles.ring}>
            <Icon icon={item.icon} size={10} />
          </div>
        </a>
      ))}
    </div>
  );
};
