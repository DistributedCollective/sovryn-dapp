import React, { useCallback, useContext } from 'react';

import {
  Heading,
  HeadingType,
  Icon,
  IconNames,
  WalletContainer,
} from '@sovryn/ui';

import {
  OriginNetwork,
  ReceiveContext,
  ReceiveStep,
} from '../../../contexts/receive-context';

export const NetworkList = () => {
  const { set } = useContext(ReceiveContext);

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
    },
    [set],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        Select the network you are transferring assets from
      </Heading>
      <WalletContainer
        name={'bitcoin'}
        icon={<Icon icon={IconNames.BITCOIN} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.BITCOIN)}
        className="mb-4"
      />
      <WalletContainer
        name={'bnb smart chain'}
        icon={<Icon icon={IconNames.BINANCE} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.BINANCE_SMART_CHAIN)}
        className="mb-4"
      />
      <WalletContainer
        name={'ethereum'}
        icon={<Icon icon={IconNames.ETHEREUM} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.ETHEREUM)}
        className="mb-4"
      />
    </div>
  );
};
