import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import {
  Heading,
  SimpleTable,
  SimpleTableRow,
  Tabs,
  TabType,
  Tooltip,
} from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../locales/i18n';
import { strategies } from '../../BobGateway.constants';
import { BitcoinWallet } from '../BitcoinWallet/BitcoinWallet';
import { BobGatewayDeposit } from '../BobGatewayDeposit/BobGatewayDeposit';
import { BobGatewayWithdraw } from '../BobGatewayWithdraw/BobGatewayWithdraw';

export const BobGatewayForm: FC = () => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [strategyAddress, setStrategyAddress] = useState<string>(
    strategies[0].strategyAddress,
  );

  const strategy = strategies.find(t => t.strategyAddress === strategyAddress);

  const items = useMemo(
    () => [
      {
        label: t(translations.bobGatewayPage.deposit),
        content: (
          <BobGatewayDeposit
            strategyAddress={strategyAddress}
            setStrategyAddress={setStrategyAddress}
            openBTCWallet={() => setIsOpen(true)}
          />
        ),
        dataAttribute: 'bob-gateway-deposit',
      },
      {
        label: (
          <Tooltip content={'Not supported by BOB Gateaway yet'}>
            <span>{t(translations.bobGatewayPage.withdraw)}</span>
          </Tooltip>
        ),
        content: <BobGatewayWithdraw strategyAddress={strategyAddress} />,
        dataAttribute: 'bob-gateway-withdraw',
        disabled: true,
      },
    ],
    [strategyAddress],
  );

  return (
    <>
      <div className="flex justify-end m-4">
        <BitcoinWallet setIsOpen={setIsOpen} isOpen={isOpen} />
      </div>
      <div className="flex flex-col md:flex-row items-start py-8 justify-center gap-6">
        <div className="p-0 sm:border sm:border-gray-50 sm:rounded w-full md:w-auto lg:min-w-[28rem] sm:p-6 sm:bg-gray-90">
          <Tabs
            items={items}
            onChange={setIndex}
            index={index}
            type={TabType.slider}
            className="w-full"
            labelsClassName="border border-gray-50"
          />
        </div>
        <SimpleTable className="flex-1 lg:max-w-[25rem]">
          <Heading className="text-lg font-medium mb-3">
            {t(translations.bobGatewayPage.strategyDetails.title)}
          </Heading>
          <SimpleTableRow
            label={t(translations.bobGatewayPage.strategyDetails.name)}
            value={
              strategy && (
                <AssetPairRenderer
                  chainId={ChainIds.BOB_MAINNET}
                  asset1={strategy.tokenA}
                  asset2={strategy.tokenB}
                />
              )
            }
            valueClassName="flex justify-end"
          />
          <SimpleTableRow
            label={t(translations.bobGatewayPage.strategyDetails.category)}
            value={strategy?.category}
          />
          <SimpleTableRow
            label={t(translations.bobGatewayPage.strategyDetails.incentives)}
            value={strategy?.incentives}
          />
          <SimpleTableRow
            label={t(translations.bobGatewayPage.strategyDetails.token)}
            value={
              <TxIdWithNotification
                href=""
                value={strategy?.strategyAddress || ''}
              />
            }
          />
          <SimpleTableRow
            className="grid-cols-3"
            label={t(translations.bobGatewayPage.strategyDetails.about)}
            value={strategy?.about}
            valueClassName="col-span-2"
          />
        </SimpleTable>
      </div>
    </>
  );
};
