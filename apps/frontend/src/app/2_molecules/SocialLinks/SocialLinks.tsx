import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { applyDataAttr, Icon, LinkBase } from '@sovryn/ui';

import { GITHUB_LINKS, SOCIAL_LINKS } from '../../../constants/links';
import { translations } from '../../../locales/i18n';
import styles from './SocialLinks.module.css';

type SocialLinksProps = {
  className?: string;
  innerClassName?: string;
  dataAttribute?: string;
};

const socials = [
  {
    id: 'discord',
    icon: 'discord-logo',
    url: SOCIAL_LINKS.DISCORD,
  },
  {
    id: 'telegram',
    icon: 'telegram-logo',
    url: SOCIAL_LINKS.TELEGRAM,
  },
  {
    id: 'twitter',
    icon: 'twitter-logo',
    url: SOCIAL_LINKS.TWITTER,
  },
  {
    id: 'github',
    icon: 'github-logo',
    url: GITHUB_LINKS.ORGANIZATION,
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
