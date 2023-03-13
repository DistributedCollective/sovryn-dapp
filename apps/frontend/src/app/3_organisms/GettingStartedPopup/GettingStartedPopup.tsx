import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { reactLocalStorage } from 'reactjs-localstorage';

import {
  Button,
  ButtonType,
  Checkbox,
  Dialog,
  DialogHeader,
  Heading,
  HeadingType,
  Icon,
  IconNames,
  Link,
  Pagination,
} from '@sovryn/ui';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { translations } from '../../../locales/i18n';
import { sovrynWikiLinks } from '../../../utils/constants';
import styles from './GettingStartedPopup.module.css';

const PAGE_SIZE = 2;
const localStorageKey = 'gettingStartedPopup';
const translationBasePath = translations.zeroPage.gettingStartedPopup.content;

type GettingStartedPopupProps = {
  isOpen: boolean;
  onConfirm: () => void;
};

export const GettingStartedPopup: FC<GettingStartedPopupProps> = ({
  isOpen,
  onConfirm,
}) => {
  const { isMobile } = useIsMobile();
  const [page, setPage] = useState(0);
  const [checked, setChecked] = useState(false);
  const pageOffset = useMemo(() => page + PAGE_SIZE, [page]);

  const data = useMemo(
    () => [
      {
        name: t(translationBasePath.pool.title),
        description: t(translationBasePath.pool.description),
        href: [sovrynWikiLinks.stabilityPool, sovrynWikiLinks.ammPool],
        learnMore: [
          t(
            translations.zeroPage.gettingStartedPopup.buttons
              .learnMoreStabilityPool,
          ),
          t(translations.zeroPage.gettingStartedPopup.buttons.learnMoreAMMPool),
        ],
        icon: IconNames.EARN_3,
      },
      {
        name: t(translationBasePath.trade.title),
        description: t(translationBasePath.trade.description),
        href: sovrynWikiLinks.trade,
        icon: IconNames.TRADING,
      },
    ],
    [],
  );

  const items = useMemo(
    () => (isMobile ? data.slice(page, pageOffset) : data),
    [isMobile, data, page, pageOffset],
  );

  const onClick = useCallback(() => {
    if (checked) {
      reactLocalStorage.set(localStorageKey, 'false');
    }
    onConfirm();
  }, [checked, onConfirm]);

  useLayoutEffect(() => {
    const localStorage = reactLocalStorage.get(localStorageKey);
    if (localStorage && isOpen) {
      onConfirm();
    }
  }, [isOpen, onConfirm]);

  return (
    <Dialog isOpen={isOpen}>
      <DialogHeader
        title={t(translations.zeroPage.gettingStartedPopup.dialogTitle)}
      />
      <div className={styles.dialog}>
        <Heading className={styles.title} type={HeadingType.h1}>
          {t(translations.zeroPage.gettingStartedPopup.title)}
        </Heading>
        <div className={classNames(styles.content, 'mb-0')}>
          <div className={styles.itemWrapper}>
            <div className={styles.image}>
              <Icon size={50} icon={IconNames.MAIL} />
            </div>
            <div className={styles.texts}>
              <Heading className={styles.name} type={HeadingType.h2}>
                {t(translationBasePath.notification.title)}
              </Heading>
              <Heading className={styles.itemDescription} type={HeadingType.h3}>
                {t(translationBasePath.notification.description)}
              </Heading>
              <Link
                text={t(
                  translations.zeroPage.gettingStartedPopup.buttons.learnMore,
                )}
                href={sovrynWikiLinks.notification}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.dialog}>
        <Heading className={styles.title} type={HeadingType.h1}>
          {t(translations.zeroPage.gettingStartedPopup.title)}
        </Heading>
        <Heading className={styles.description} type={HeadingType.h2}>
          {t(translations.zeroPage.gettingStartedPopup.description)}
        </Heading>
        <div className={styles.content}>
          {items.map(item => (
            <div className={styles.itemWrapper} key={item.name}>
              <div className={styles.image}>
                <Icon size={70} icon={item.icon} />
              </div>
              <div className={styles.texts}>
                <Heading className={styles.name} type={HeadingType.h2}>
                  {item.name}
                </Heading>
                <Heading
                  className={styles.itemDescription}
                  type={HeadingType.h3}
                >
                  {item.description}
                </Heading>
                {Array.isArray(item.href) ? (
                  <>
                    {item.href.map((href, index) => (
                      <Link
                        text={
                          item.learnMore
                            ? item.learnMore[index]
                            : t(
                                translations.zeroPage.gettingStartedPopup
                                  .buttons.learnMore,
                              )
                        }
                        href={href}
                        key={index}
                      />
                    ))}
                  </>
                ) : (
                  <Link
                    text={t(
                      translations.zeroPage.gettingStartedPopup.buttons
                        .learnMore,
                    )}
                    href={item.href}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {isMobile && (
          <div className={styles.pagination}>
            <Pagination
              itemsPerPage={PAGE_SIZE}
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
            label={t(
              translations.zeroPage.gettingStartedPopup.buttons.doNotShowAgain,
            )}
            checked={checked}
          />
          <Button
            type={ButtonType.button}
            text={t(translations.zeroPage.gettingStartedPopup.buttons.finish)}
            onClick={onClick}
          />
        </div>
      </div>
    </Dialog>
  );
};
