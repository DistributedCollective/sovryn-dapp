import React, { FC, useCallback, useRef, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { useOnClickOutside } from '@sovryn/ui';

import { ReactComponent as AppsIcon } from '../../../../../assets/images/apps-icon.svg';
import { ALPHA_LINKS } from '../../../../../constants/links';
import { translations } from '../../../../../locales/i18n';
import { Environments } from '../../../../../types/global';
import { isMainnet, isStaging } from '../../../../../utils/helpers';
import { ProductLink } from '../ProductLink/ProductLink';
import styles from './ProductLinks.module.css';

const linkToAlpha = (path?: string) =>
  `${
    isStaging()
      ? ALPHA_LINKS.STAGING
      : ALPHA_LINKS[isMainnet() ? Environments.Mainnet : Environments.Testnet]
  }${path}`;

const linkToBitocracy = isMainnet()
  ? 'https://bitocracy.sovryn.app'
  : 'https://bitocracy.test.sovryn.app';

export const ProductLinks: FC = () => {
  const [isOpen, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([dropdownRef], () => setOpen(false));

  const handleToggle = useCallback(() => setOpen(v => !v), []);

  return (
    <li className="lg:order-first relative">
      <button
        className={classNames(styles.button, {
          [styles.active]: isOpen,
        })}
        onClick={handleToggle}
      >
        <AppsIcon className="w-6 h-6" />
      </button>
      <div
        className={classNames(styles.dropdownOrList, {
          'lg:hidden': !isOpen,
        })}
        ref={dropdownRef}
      >
        <h3 className="px-2 py-4 lg:p-0">
          {t(translations.productLinks.title)}
        </h3>
        <ol className={styles.list}>
          <ProductLink
            href={linkToAlpha('/swap')}
            label={t(translations.productLinks.swap.title)}
            description={t(translations.productLinks.swap.description)}
          />
          <ProductLink
            href={linkToAlpha('/spot')}
            label={t(translations.productLinks.spot.title)}
            description={t(translations.productLinks.spot.description)}
          />
          <ProductLink
            href={linkToAlpha('/trade')}
            label={t(translations.productLinks.trade.title)}
            description={t(translations.productLinks.trade.description)}
          />
          <ProductLink
            href={linkToAlpha('/yield-farm')}
            label={t(translations.productLinks.yield.title)}
            description={t(translations.productLinks.yield.description)}
          />
          <ProductLink
            href={linkToAlpha('/lend')}
            label={t(translations.productLinks.lend.title)}
            description={t(translations.productLinks.lend.description)}
          />
          <ProductLink
            href={linkToAlpha('/borrow')}
            label={t(translations.productLinks.borrow.title)}
            description={t(translations.productLinks.borrow.description)}
          />
          <ProductLink
            href={linkToAlpha('/stake')}
            label={t(translations.productLinks.stake.title)}
            description={t(translations.productLinks.stake.description)}
          />
          <ProductLink
            href={linkToBitocracy}
            label={t(translations.productLinks.vote.title)}
            description={t(translations.productLinks.vote.description)}
          />
        </ol>
      </div>
    </li>
  );
};
