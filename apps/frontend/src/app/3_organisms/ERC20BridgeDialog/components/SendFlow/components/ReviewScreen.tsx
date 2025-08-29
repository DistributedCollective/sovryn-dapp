import React, { useCallback, useContext, useMemo } from 'react';

import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { TxStep } from '@sovryn/sdk';
import { Button, prettyTx } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { TransactionIdRenderer } from '../../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { translations } from '../../../../../../locales/i18n';
import { sharedState } from '../../../../../../store/rxjs/shared-state';
import { formatValue } from '../../../../../../utils/math';
import { SendFlowContext } from '../../../contexts/sendflow';
import { useBridge } from '../../../hooks/useBridge';
import { useBridgeLimits } from '../../../hooks/useBridgeLimits';
import { useBridgeService } from '../../../hooks/useBridgeService';
import { TxStatusTitle } from '../../TxStatusTitle';

const translation = translations.erc20Bridge.confirmationScreens;

export const ReviewScreen: React.FC = () => {
  const { token, chainId, amount, receiver } = useContext(SendFlowContext);
  const bridgeService = useBridgeService();
  const { data: limits } = useBridgeLimits(RSK_CHAIN_ID, chainId, token);
  const assetDetails = useTokenDetailsByAsset(token, RSK_CHAIN_ID);
  const { handleSubmit, transaction, isAmountValid } = useBridge({
    sourceChain: RSK_CHAIN_ID,
    targetChain: chainId!,
    asset: token!,
    amount: parseUnits(amount || '0', assetDetails?.decimals).toString(),
    receiver,
  });

  const handleErc20BridgeDialogClose = useCallback(
    () => sharedState.actions.closeErc20BridgeDialog(),
    [],
  );

  const items = useMemo(
    () => [
      {
        label: t(translation.amount),
        value: <>{formatValue(Number(amount), 8)}</>,
      },
      {
        label: t(translation.token),
        value: (
          <>
            {token} {'->'} {token}
          </>
        ),
      },
      {
        label: t(translation.originNetwork),
        value: bridgeService.getNetworkConfig(RSK_CHAIN_ID)?.name,
      },
      {
        label: t(translation.destinationNetwork),
        value: chainId ? bridgeService.getNetworkConfig(chainId)?.name : '',
      },
      {
        label: t(translation.receiver),
        value: prettyTx(receiver),
      },
      {
        label: t(translation.serviceFee),
        value:
          limits && token
            ? `${formatUnits(limits.feePerToken)} ${getTokenDisplayName(token)}`
            : '-',
      },
    ],
    [amount, bridgeService, chainId, limits, receiver, token],
  );
  const isLoading = [
    TxStep.APPROVING,
    TxStep.CONFIRMING,
    TxStep.PENDING,
  ].includes(transaction.step);

  return (
    <div className="text-center">
      <TxStatusTitle step={transaction.step} />

      <div className="bg-gray-80 border rounded border-gray-50 p-3 text-xs text-gray-30 flex flex-col gap-3">
        {items.map(({ label, value }, index) => (
          <div className="flex justify-between" key={label}>
            <span>{label} </span>
            <span>{value}</span>
          </div>
        ))}

        {transaction.transferHash && (
          <div className="flex justify-between">
            <span>{t(translation.rootstockTxId)} </span>
            <span>
              {
                <TransactionIdRenderer
                  hash={transaction.transferHash}
                  chainId={RSK_CHAIN_ID}
                />
              }
            </span>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button
          text={
            transaction.step === TxStep.CONFIRMED
              ? t(translations.common.buttons.done)
              : t(translations.common.buttons.confirm)
          }
          onClick={
            transaction.step === TxStep.CONFIRMED
              ? handleErc20BridgeDialogClose
              : handleSubmit
          }
          loading={isLoading}
          disabled={isLoading || !isAmountValid}
          className="w-full"
          dataAttribute="erc20-send-confirm"
        />
      </div>
    </div>
  );
};
