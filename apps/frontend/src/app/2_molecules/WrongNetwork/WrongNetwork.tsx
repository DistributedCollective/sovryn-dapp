import React, { FC, useCallback, useMemo } from 'react';

import classNames from 'classnames';

import { ChainIds } from '@sovryn/ethers-provider';
import {
  Button,
  ButtonStyle,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { useWalletConnect } from '../../../hooks';

type WrongNetworkProps = {
  className?: string;
};

export const WrongNetwork: FC<WrongNetworkProps> = ({ className }) => {
  const { wallets, switchNetwork } = useWalletConnect();

  const isWrongChain = useMemo(() => {
    return (
      wallets[0]?.accounts[0]?.address &&
      wallets[0].chains[0].id !== ChainIds.RSK_TESTNET
    );
  }, [wallets]);

  const switchChain = useCallback(() => {
    switchNetwork(ChainIds.RSK_TESTNET);
  }, [switchNetwork]);

  if (!isWrongChain) return null;

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
          className="text-gray-80 font-medium"
          size={ParagraphSize.base}
        >
          Wrong network
        </Paragraph>
      </div>
      <Paragraph className="mt-3 ml-7 text-gray-80 font-medium">
        We detected that you are curently conected to the wrong network. please
        swich to the RSK network in your browser wallet
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
