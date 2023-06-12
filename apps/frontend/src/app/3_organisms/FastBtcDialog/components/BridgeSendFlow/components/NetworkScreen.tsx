import React, { useCallback, useContext, useReducer } from 'react';

import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import {
  Accordion,
  Heading,
  HeadingType,
  Icon,
  IconNames,
  SimpleTable,
  SimpleTableRow,
  TransactionId,
  WalletContainer,
} from '@sovryn/ui';

import { defaultChainId } from '../../../../../../config/chains';

import { useNetworkContext } from '../../../../../../contexts/NetworkContext';
import { translations } from '../../../../../../locales/i18n';
import { SendContext, SendStep } from '../../../contexts/send-context';
import { OriginNetwork } from '../../../types';
import { getNetwork } from '../../../utils/networks';

const translation = translations.fastBtc.send.networkScreen;

export const NetworkScreen: React.FC = () => {
  const [openBtcNetwork, toggleBtcNetwork] = useReducer(v => !v, false);
  const [openEthNetwork, toggleEthNetwork] = useReducer(v => !v, false);

  const { set } = useContext(SendContext);
  const { requireChain } = useNetworkContext();

  const handleNetworkClick = useCallback(
    (network: OriginNetwork) => () => {
      set(prevState => ({
        ...prevState,
        step:
          network === OriginNetwork.BITCOIN
            ? SendStep.BITCOIN_FLOW
            : SendStep.SENDER_ASSET,
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

  //@TODO: Replace with real data
  const availableLiquidity = [
    {
      label: 'BNB',
      value: '0.0001 BTC',
      transactionId: '0x1234567890123456789012345678901234567890',
    },
    {
      label: 'BUSD',
      value: '123,456,78 BUSD',
      transactionId: '0x0987654321098765432109876543210987654321',
    },
    {
      label: 'ETH',
      value: '0.123 ETH',
      transactionId: '0xabcdef0123456789abcdef0123456789abcdef01',
    },
    {
      label: 'BTC',
      value: '0.001 BTC',
      transactionId: '0x5678901234567890123456789012345678901234',
    },
    {
      label: 'USDT',
      value: '9,876 USDT',
      transactionId: '0x3456789012345678901234567890123456789012',
    },
    {
      label: 'USDC',
      value: '123,456 USDC',
      transactionId: '0x6789012345678901234567890123456789012345',
    },
  ];

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translation.title)}
      </Heading>

      <WalletContainer
        name={t(translations.common.networks.bitcoin)}
        icon={<Icon icon={IconNames.BITCOIN} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.BITCOIN)}
        className="mb-4"
      />
      <WalletContainer
        name={t(translations.common.networks.bnb)}
        icon={<Icon icon={IconNames.BINANCE} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.BINANCE_SMART_CHAIN)}
        className="mb-4"
      />

      <Accordion
        open={openBtcNetwork}
        label={t(translations.advancedSettings.label)}
        onClick={toggleBtcNetwork}
        children={
          <SimpleTable>
            {availableLiquidity.map((item, index) => (
              <SimpleTableRow
                key={index}
                label={
                  <div className="flex justify-between">
                    <span>{item.label}</span>
                    <TransactionId
                      href="#"
                      value={item.transactionId}
                      dataAttribute={`funding-send-transaction-id-${item.label}`}
                    />
                  </div>
                }
                value={item.value}
              />
            ))}
          </SimpleTable>
        }
        dataAttribute="funding-send-available-liquidity-btc-accordion"
        className="mb-4"
      />

      <WalletContainer
        name={t(translations.common.networks.ethereum)}
        icon={<Icon icon={IconNames.ETHEREUM} size={24} />}
        onClick={handleNetworkClick(OriginNetwork.ETHEREUM)}
        className="mb-4"
      />
      <Accordion
        open={openEthNetwork}
        label={t(translations.advancedSettings.label)}
        onClick={toggleEthNetwork}
        children={
          <SimpleTable>
            {availableLiquidity.map((item, index) => (
              <SimpleTableRow
                key={index}
                label={
                  <div className="flex justify-between">
                    <span>{item.label}</span>
                    <TransactionId
                      href="#"
                      value={item.transactionId}
                      dataAttribute={`transaction-id-${item.label}`}
                    />
                  </div>
                }
                value={item.value}
              />
            ))}
          </SimpleTable>
        }
        dataAttribute="funding-send-available-liquidity-eth-accordion"
      />
    </div>
  );
};
