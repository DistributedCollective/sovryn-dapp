import React, { FC, useCallback, useLayoutEffect, useState } from 'react';

import { t } from 'i18next';
import { reactLocalStorage } from 'reactjs-localstorage';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { STAKING_REWARDS_LEARN_MORE_LINK } from '../../StakePage.constants';

const LOCAL_STORAGE_KEY = 'stakingRewards';

export const StakingRewards: FC = () => {
  const [isOpen, setIsOpen] = useState(
    !reactLocalStorage.get(LOCAL_STORAGE_KEY),
  );

  const handleToggle = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
    reactLocalStorage.set(LOCAL_STORAGE_KEY, true);
  }, []);

  useLayoutEffect(() => {
    if (!reactLocalStorage.get(LOCAL_STORAGE_KEY)) {
      setIsOpen(true);
    }
  }, []);

  return (
    <>
      {isOpen && (
        <div className="relative w-full rounded border border-gray-70 my-3 md:my-0 md:px-9 p-4 md:max-w-[28.5rem]">
          <button
            className="md:hidden visible absolute top-4 right-4"
            onClick={handleToggle}
          >
            <Icon icon={IconNames.X_MARK} size={12} />
          </button>

          <div className="text-gray-30 mb-3 leading-4 text-xs">
            {t(translations.stakePage.stakingRewards.title)}
          </div>

          <Paragraph
            style={ParagraphStyle.normal}
            size={ParagraphSize.base}
            className="mb-6"
          >
            {t(translations.stakePage.stakingRewards.description)}
          </Paragraph>

          <div className="flex items-center gap-4">
            <Button
              text={t(translations.stakePage.stakingRewards.buySov)}
              href="/convert"
              dataAttribute="staking-rewards-button"
              style={ButtonStyle.secondary}
              size={ButtonSize.large}
              className="text-gray-10 whitespace-nowrap"
            />
            <Button
              text={t(translations.stakePage.stakingRewards.learnMore)}
              href={STAKING_REWARDS_LEARN_MORE_LINK}
              dataAttribute="staking-rewards-learn-more"
              style={ButtonStyle.ghost}
              hrefExternal
            />
          </div>
        </div>
      )}
    </>
  );
};
