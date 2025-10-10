import React, { useCallback, useContext, useMemo } from 'react';

import dayjs from 'dayjs';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { TxStep } from '@sovryn/sdk';
import { Button } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { TransactionIdRenderer } from '../../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { useAccount } from '../../../../../../hooks';
import { useChainStore } from '../../../../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { translations } from '../../../../../../locales/i18n';
import { sharedState } from '../../../../../../store/rxjs/shared-state';
import { getChainById } from '../../../../../../utils/chain';
import { formatValue } from '../../../../../../utils/math';
import {
  ReceiveFlowContext,
  ReceiveFlowStep,
} from '../../../contexts/receiveflow';
import { useBridge } from '../../../hooks/useBridge';
import { useBridgeLimits } from '../../../hooks/useBridgeLimits';
import { useBridgeService } from '../../../hooks/useBridgeService';
import { TxStatusTitle } from '../../TxStatusTitle';

const translation = translations.erc20Bridge.confirmationScreens;

export const ReviewScreen: React.FC = () => {
  const { token, chainId, amount, receiver, set } =
    useContext(ReceiveFlowContext);
  const { account } = useAccount();
  const sourceChain = getChainById(chainId!);
  const targetChain = getChainById(RSK_CHAIN_ID);
  const bridgeService = useBridgeService();
  const { currentChainId, setCurrentChainId } = useChainStore();
  const { data: limits } = useBridgeLimits(chainId, RSK_CHAIN_ID, token);
  const assetDetails = useTokenDetailsByAsset(token, chainId);
  const isWrongChain = RSK_CHAIN_ID !== currentChainId;

  const { handleSubmit, transaction } = useBridge({
    sourceChain: chainId!,
    targetChain: RSK_CHAIN_ID,
    asset: token!,
    amount: parseUnits(amount || '0', assetDetails?.decimals).toString(),
    receiver,
    onSuccess: () =>
      set(prev => ({ ...prev, step: ReceiveFlowStep.COMPLETED })),
    onTxStart: () =>
      set(prev => ({ ...prev, step: ReceiveFlowStep.PROCESSING })),
  });

  const handleErc20BridgeDialogClose = useCallback(
    () => sharedState.actions.closeErc20BridgeDialog(),
    [],
  );

  const items = useMemo(() => {
    if (transaction.step === TxStep.IDLE) {
      return [
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
          value: chainId ? bridgeService.getNetworkConfig(chainId)?.name : '',
        },
        {
          label: t(translation.destinationNetwork),
          value: bridgeService.getNetworkConfig(RSK_CHAIN_ID)?.name,
        },
        {
          label: t(translation.date),
          value: dayjs().format('M/D/YYYY'),
        },
        {
          label: t(translation.serviceFee),
          value:
            limits && token
              ? `${formatUnits(limits.feePerToken)} ${getTokenDisplayName(
                  token,
                )}`
              : '-',
        },
        {
          label: t(translation.receiver),
          value: (
            <TxIdWithNotification
              href={`${targetChain?.blockExplorerUrl}/address/${receiver}`}
              value={receiver}
            />
          ),
        },
      ];
    }
    const list = [
      {
        label: t(translation.from),
        value: (
          <TxIdWithNotification
            href={`${sourceChain?.blockExplorerUrl}/address/${account}`}
            value={account}
          />
        ),
      },
      {
        label: t(translation.to),
        value: (
          <TxIdWithNotification
            href={`${targetChain?.blockExplorerUrl}/address/${receiver}`}
            value={receiver}
          />
        ),
      },
      {
        label: t(translation.serviceFee),
        value:
          limits && token
            ? `${formatUnits(limits.feePerToken)} ${getTokenDisplayName(token)}`
            : '-',
      },
      {
        label: t(translation.sendingAmount),
        value: (
          <>
            {formatValue(Number(amount), 8)} {getTokenDisplayName(token!)}
          </>
        ),
      },
      {
        label: t(translation.receivingAmount),
        value: (
          <>
            {formatValue(
              Number(amount) - Number(formatUnits(limits?.feePerToken || '0')),
              8,
            )}{' '}
            {getTokenDisplayName(token!)}
          </>
        ),
      },
    ];

    if (transaction.transferHash) {
      list.push({
        label: t(translation.transactionID),
        value: (
          <TransactionIdRenderer
            hash={transaction.transferHash}
            chainId={chainId}
          />
        ),
      });
    }
    return list;
  }, [
    account,
    amount,
    bridgeService,
    chainId,
    limits,
    receiver,
    sourceChain?.blockExplorerUrl,
    targetChain?.blockExplorerUrl,
    token,
    transaction.step,
    transaction.transferHash,
  ]);

  const isLoading = [
    TxStep.APPROVING,
    TxStep.CONFIRMING,
    TxStep.PENDING,
  ].includes(transaction.step);
  const isConfirmed = transaction.step === TxStep.CONFIRMED;

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
      </div>

      <div className="mt-12">
        <Button
          text={
            isConfirmed
              ? isWrongChain
                ? t(translations.erc20Bridge.confirmationScreens.switchNetwork)
                : t(translations.common.buttons.done)
              : [TxStep.USER_DENIED, TxStep.FAILED].includes(transaction.step)
              ? t(translations.common.buttons.retry)
              : t(translations.common.buttons.confirm)
          }
          onClick={
            isConfirmed
              ? isWrongChain
                ? () => setCurrentChainId(RSK_CHAIN_ID)
                : handleErc20BridgeDialogClose
              : handleSubmit
          }
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
          dataAttribute="erc20-receive-confirm"
        />
      </div>
    </div>
  );
};
