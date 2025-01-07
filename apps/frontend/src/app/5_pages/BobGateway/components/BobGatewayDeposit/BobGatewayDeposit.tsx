import { useAccount, useBalance } from '@gobob/sats-wagmi';

import React, { FC, useEffect, useMemo, useState } from 'react';

import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import { AmountInput, Button, ButtonSize, Select } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useCacheCall } from '../../../../../hooks';
import { useAccount as useEvmAccount } from '../../../../../hooks/useAccount';
import { useDollarValue } from '../../../../../hooks/useDollarValue';
import { translations } from '../../../../../locales/i18n';
import { toWei } from '../../../../../utils/math';
import { bobGateway, strategies } from '../../BobGateway.utils';
import { useSendGatewayTransaction } from '../../hooks/useSendGatewayTransaction';

const commonTranslations = translations.common;

type BobGatewayDepositProps = {
  setStrategyAddress: (strategy: string) => void;
  strategyAddress: string;
};

export const BobGatewayDeposit: FC<BobGatewayDepositProps> = ({
  strategyAddress,
  setStrategyAddress,
}) => {
  const [amount, setAmount] = useState('');
  const { address: btcAddress } = useAccount();
  const { account } = useEvmAccount();
  const { data } = useBalance();
  const btcPrice = useDollarValue(
    'BTC',
    toWei(1).toString(),
    ChainIds.RSK_MAINNET,
  );
  const { isPending, sendGatewayTransaction } = useSendGatewayTransaction({
    toChain: 'bob',
  });

  const onSubmit = async () => {
    const strategy = strategies.find(
      t => t.strategyAddress === strategyAddress,
    );

    if (!account || !amount || !strategy) {
      return;
    }

    const params = {
      toToken: strategy.toToken,
      evmAddress: account,
      value: BigInt(parseUnits(amount, 8).toString()),
      strategyAddress: strategy.strategyAddress,
    };

    console.log(params);

    sendGatewayTransaction(params, {
      onError: error => console.log({ error }),
    });
  };

  const { value: orders } = useCacheCall(
    `bob-orders/${account}`,
    BOB_CHAIN_ID,
    async () => {
      const result = await bobGateway.getOrders(account);
      return result;
    },
    [account],
    [],
  );

  useEffect(() => {
    if (orders.length) {
      console.log({
        orders,
      });
    }
  }, [orders]);

  const isDisabled = useMemo(() => {
    return (
      !btcAddress ||
      !amount ||
      !strategyAddress ||
      Number(formatUnits(data?.confirmed.toString() || '0', 8)) < Number(amount)
    );
  }, [amount, btcAddress, data?.confirmed, strategyAddress]);

  return (
    <div className="flex flex-col">
      <div
        onClick={() =>
          setAmount(formatUnits(data?.confirmed.toString() || '0', 8))
        }
        className="cursor-pointer self-end text-gray-20 text-xs mt-5 mb-1"
      >
        (max: {formatUnits(data?.confirmed.toString() || '0', 8)} wBTC)
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <AmountInput
            placeholder="Amount (BTC)"
            step="0.00000001"
            value={amount}
            onChangeText={setAmount}
            label={t(commonTranslations.amount)}
          />
          <div className="absolute right-0 text-gray-40 text-xs mt-0.5 mr-2">
            $
            {Decimal.from(btcPrice.usdPrice || '0')
              .mul(amount || '0')
              .toString()}
          </div>
        </div>

        <div className="bg-gray-70 p-2.5 rounded">
          <AssetRenderer asset="wBTC" showAssetLogo />
        </div>
      </div>
      <div className="mb-6">
        <div className="text-gray-30 text-xs mb-2 font-medium">
          Select strategy
        </div>
        <Select
          value={strategyAddress}
          onChange={setStrategyAddress}
          options={strategies.map(strategy => ({
            value: strategy.strategyAddress,
            label: (
              <div className="flex items-center gap-2">{strategy.name}</div>
            ),
          }))}
          className="min-w-36 w-full"
        />
      </div>

      <Button
        size={ButtonSize.large}
        loading={isPending}
        disabled={isDisabled}
        text={btcAddress ? 'Deposit' : 'Connect Wallet'}
        onClick={onSubmit}
      />
    </div>
  );
};
