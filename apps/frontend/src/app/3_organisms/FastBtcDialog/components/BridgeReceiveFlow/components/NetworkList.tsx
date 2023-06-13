import React, { useCallback, useContext } from 'react';

import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import {
  Heading,
  HeadingType,
  Icon,
  IconNames,
  WalletContainer,
} from '@sovryn/ui';

import { defaultChainId } from '../../../../../../config/chains';

import { useNetworkContext } from '../../../../../../contexts/NetworkContext';
import { translations } from '../../../../../../locales/i18n';
import {
  OriginNetwork,
  ReceiveContext,
  ReceiveStep,
} from '../../../contexts/receive-context';
import { getNetwork } from '../utils/networks';

const translation = translations.fastBtc.receive.networkScreen;

export const NetworkList = () => {
  const { set } = useContext(ReceiveContext);
  const { requireChain } = useNetworkContext();

  const handleNetworkClick = useCallback(
    (network: OriginNetwork) => () => {
      set(prevState => ({
        ...prevState,
        step:
          network === OriginNetwork.BITCOIN
            ? ReceiveStep.BITCOIN_FLOW
            : ReceiveStep.SELECT_ASSET,
        originNetwork: network,
      }));

      requireChain(
        (network === OriginNetwork.BITCOIN
          ? defaultChainId
          : getNetwork(network).chainId) as ChainIds,
      );
    },
    [requireChain, set],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translation.title)}
      </Heading>
      <WalletContainer
        name="Bitcoin"
        icon={<Icon icon={IconNames.BITCOIN} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.BITCOIN)}
        className="mb-4"
      />
      <WalletContainer
        name={getNetwork(OriginNetwork.BINANCE_SMART_CHAIN).label}
        icon={<Icon icon={IconNames.BINANCE} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.BINANCE_SMART_CHAIN)}
        className="mb-4"
      />
      <WalletContainer
        name={getNetwork(OriginNetwork.ETHEREUM).label}
        icon={<Icon icon={IconNames.ETHEREUM} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.ETHEREUM)}
        className="mb-4"
      />
    </div>
  );
};
