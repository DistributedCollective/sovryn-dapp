import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from 'reactjs-localstorage';

import {
  Button,
  ButtonType,
  Checkbox,
  Dialog,
  Heading,
  HeadingType,
  Link,
  Pagination,
} from '@sovryn/ui';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { translations } from '../../../locales/i18n';
import { sovrynWikiLinks } from '../../../utils/constants';
import styles from './GettingStartedPopup.module.css';

const DEFAULT_PAGE_SIZE = 1;

export const GettingStartedPopup: FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useIsMobile();
  const [page, setPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const pageOffset = useMemo(() => page + DEFAULT_PAGE_SIZE, [page]);

  const data = useMemo(
    () => [
      {
        name: t(translations.gettingStartedPopup.content.pool.title),
        description: t(
          translations.gettingStartedPopup.content.pool.description,
        ),
        href: sovrynWikiLinks.pool,
      },
      {
        name: t(translations.gettingStartedPopup.content.lend.title),
        description: t(
          translations.gettingStartedPopup.content.lend.description,
        ),
        href: sovrynWikiLinks.lend,
      },
      {
        name: t(translations.gettingStartedPopup.content.trade.title),
        description: t(
          translations.gettingStartedPopup.content.trade.description,
        ),
        href: sovrynWikiLinks.trade,
      },
      {
        name: t(translations.gettingStartedPopup.content.bridge.title),
        description: t(
          translations.gettingStartedPopup.content.bridge.description,
        ),
        href: sovrynWikiLinks.bridge,
      },
    ],
    [t],
  );

  const items = useMemo(
    () => (isMobile ? data.slice(page, pageOffset) : data),
    [data, pageOffset, isMobile, page],
  );

  const onClick = useCallback(() => {
    if (checked) {
      reactLocalStorage.set('gettingStartedPopup', 'false');
    }
    setIsOpen(false);
  }, [checked]);

  useEffect(() => {
    const localStorage = reactLocalStorage.get('gettingStartedPopup');
    if (!localStorage) {
      setIsOpen(true);
    }
  }, []);

  return (
    <Dialog isOpen={isOpen} className={styles.dialog}>
      <Heading type={HeadingType.h1}>
        {t(translations.gettingStartedPopup.title)}
      </Heading>
      <Heading type={HeadingType.h2}>
        {t(translations.gettingStartedPopup.description)}
      </Heading>
      <div className={styles.content}>
        {items.map(item => (
          <div className={styles.box} key={item.name}>
            <div className={styles.image}></div>
            <div className={styles.boxContent}>
              <Heading type={HeadingType.h2}>{item.name}</Heading>
              <Heading type={HeadingType.h3}>{item.description}</Heading>
              <Link
                text={t(translations.gettingStartedPopup.buttons.learnMore)}
                href={item.href}
                openNewTab
              />
            </div>
          </div>
        ))}
      </div>

      {isMobile && (
        <div className={styles.pagination}>
          <Pagination
            itemsPerPage={DEFAULT_PAGE_SIZE}
            hideFirstPageButton
            hideLastPageButton
            totalItems={data.length}
            page={page}
            onChange={setPage}
          />
        </div>
      )}

      <div className={styles.actions}>
        <Checkbox
          onChangeValue={setChecked}
          label={t(translations.gettingStartedPopup.buttons.doNotShowAgain)}
          checked={checked}
        />
        <Button
          type={ButtonType.button}
          text={t(translations.gettingStartedPopup.buttons.gotIt)}
          onClick={onClick}
        />
      </div>
    </Dialog>
  );
};
