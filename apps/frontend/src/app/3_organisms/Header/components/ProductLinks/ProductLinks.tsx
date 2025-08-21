import React, { FC, useCallback, useRef, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { useOnClickOutside } from '@sovryn/ui';

import { ReactComponent as AppsIcon } from '../../../../../assets/images/apps-icon.svg';
import { translations } from '../../../../../locales/i18n';
import { generateD1Link } from '../../../../../utils/helpers';
import { ProductLink } from '../ProductLink/ProductLink';
import styles from './ProductLinks.module.css';

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
            href={generateD1Link('/spot')}
            label={t(translations.productLinks.spot.title)}
            description={t(translations.productLinks.spot.description)}
          />
          <ProductLink
            href={generateD1Link('/trade')}
            label={t(translations.productLinks.trade.title)}
            description={t(translations.productLinks.trade.description)}
          />
        </ol>
      </div>
    </li>
  );
};
