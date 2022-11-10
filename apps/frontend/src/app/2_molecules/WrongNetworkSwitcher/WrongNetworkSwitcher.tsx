import React, { FC, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonStyle,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { useWalletConnect } from '../../../hooks';
import { requiredChain } from '../../../utils/constants';

type WrongNetworkSwitcherProps = {
  className?: string;
};

export const WrongNetworkSwitcher: FC<WrongNetworkSwitcherProps> = ({
  className,
}) => {
  const { wallets, switchNetwork } = useWalletConnect();
  const { t } = useTranslation();

  const isWrongChain = useMemo(() => {
    return (
      wallets[0]?.accounts[0]?.address &&
      wallets[0].chains[0].id !== requiredChain
    );
  }, [wallets]);

  const switchChain = useCallback(() => {
    switchNetwork(requiredChain);
  }, [switchNetwork]);

  if (!isWrongChain) {
    return null;
  }

  return (
    <div
      className={classNames(
        'bg-gray-20 z-10 rounded border-l border-l-[3px] border-l-warning px-4 py-3 min-w-80 shadow-md',
        className,
      )}
    >
      <div className="flex items-center">
        <Icon
          className="text-warning mr-2"
          icon={IconNames.WARNING}
          size={18}
        />
        <Paragraph
          className="text-sovryn-black font-medium"
          size={ParagraphSize.base}
        >
          {t('wrongNetworkSwitcher.title')}
        </Paragraph>
      </div>
      <Paragraph className="mt-3 ml-7 text-sovryn-black font-medium">
        {t('wrongNetworkSwitcher.description', { network: requiredChain })}
      </Paragraph>
      <Button
        className="mb-2 mt-7 ml-7"
        style={ButtonStyle.secondary}
        text="Switch"
        onClick={switchChain}
      />
    </div>
  );
};
