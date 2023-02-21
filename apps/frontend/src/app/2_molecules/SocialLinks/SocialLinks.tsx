import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { applyDataAttr, Icon, LinkBase } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { sovrynLinks } from '../../../utils/constants';
import styles from './SocialLinks.module.css';

export type SocialLinksProps = {
  className?: string;
  innerClassName?: string;
  dataAttribute?: string;
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
  dataAttribute,
}) => {
  return (
    <div
      className={classNames(styles.socials, className)}
      {...applyDataAttr(dataAttribute)}
    >
      {socials.map(item => (
        <LinkBase
          href={item.url}
          className={classNames(styles.container, innerClassName)}
          openNewTab
          title={t(translations.common.socials[item.id])}
          key={item.id}
          dataAttribute={`${dataAttribute}-${item.id}`}
        >
          <div className={styles.ring}>
            <Icon icon={item.icon} size={10} />
          </div>
        </LinkBase>
      ))}
    </div>
  );
};
