import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import { t } from 'i18next';

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

import { translations } from '../../../../../../locales/i18n';
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';

const translation = translations.fastBtc.send.networkScreen;

export const NetworkScreen: React.FC = () => {
  const [openBtcNetwork, toggleBtcNetwork] = useReducer(v => !v, false);
  const [openEthNetwork, toggleEthNetwork] = useReducer(v => !v, false);
  const [selectedNetwork, setSelectedNetwork] = useState('');

  const { set } = useContext(WithdrawContext);
  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        step:
          selectedNetwork === 'BTC'
            ? WithdrawStep.AMOUNT
            : WithdrawStep.SENDER_ASSET,
      })),
    [set, selectedNetwork],
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

  useEffect(() => {
    if (selectedNetwork) {
      onContinueClick();
    }
  }, [selectedNetwork, onContinueClick]);

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translation.title)}
      </Heading>

      <WalletContainer
        name={t(translations.common.networks.bitcoin)}
        icon={<Icon icon={IconNames.BITCOIN} size={24} />}
        onClick={() => setSelectedNetwork('BTC')}
        className="mb-4"
      />
      <WalletContainer
        name={t(translations.common.networks.bnb)}
        icon={<Icon icon={IconNames.BINANCE} size={24} />}
        onClick={() => setSelectedNetwork('BNB')}
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
        onClick={() => setSelectedNetwork('ETH')}
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
