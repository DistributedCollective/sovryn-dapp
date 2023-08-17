import React, {
  FC,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { reactLocalStorage } from 'reactjs-localstorage';

import {
  Button,
  ButtonStyle,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';

import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';

type BannerProps = {
  localStorageKey: string;
  title: string;
  description: ReactNode;
  learnMore?: string;
  action: ReactNode;
  className?: string;
};

export const Banner: FC<BannerProps> = ({
  localStorageKey,
  learnMore,
  title,
  description,
  action,
  className,
}) => {
  const { isMobile } = useIsMobile();
  const [isOpen, setIsOpen] = useState(!reactLocalStorage.get(localStorageKey));

  const handleToggle = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
    reactLocalStorage.set(localStorageKey, true);
  }, [localStorageKey]);

  useLayoutEffect(() => {
    if (!reactLocalStorage.get(localStorageKey)) {
      setIsOpen(true);
    }
  }, [localStorageKey]);

  return (
    <>
      {(isOpen || !isMobile) && (
        <div
          className={classNames(
            'relative scrollbar-hide w-full rounded border border-gray-70 p-6',
            className,
          )}
        >
          <button
            className="md:hidden visible absolute top-4 right-4"
            onClick={handleToggle}
          >
            <Icon icon={IconNames.X_MARK} size={12} />
          </button>

          <div className="text-gray-30 mb-2 leading-4 text-xs">{title}</div>

          <Paragraph
            style={ParagraphStyle.normal}
            size={ParagraphSize.base}
            className="mb-4 leading-5"
          >
            {description}
          </Paragraph>

          <div className="flex items-center gap-4">
            {action}
            {learnMore && (
              <Button
                text={t(translations.stakePage.stakingRewards.learnMoreLink)}
                href={learnMore}
                style={ButtonStyle.ghost}
                hrefExternal
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
