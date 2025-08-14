import React, { useContext, useMemo } from 'react';

import classNames from 'classnames';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { TxStep } from '@sovryn/sdk';
import { Button, Heading, HeadingType, prettyTx } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { translations } from '../../../../../../locales/i18n';
import { formatValue } from '../../../../../../utils/math';
import { ReceiveFlowContext } from '../../../contexts/receiveflow';
import { useBridgeLimits } from '../../../hooks/useBridgeLimits';
import { useBridgeSend } from '../../../hooks/useBridgeSend';
import { useBridgeService } from '../../../hooks/useBridgeService';

const translation = translations.erc20Bridge.confirmationScreens;

export const ReviewScreen: React.FC = () => {
  const { token, chainId, amount, receiver } = useContext(ReceiveFlowContext);
  const bridgeService = useBridgeService();
  const { data: limits } = useBridgeLimits(RSK_CHAIN_ID, chainId, token);
  const assetDetails = useTokenDetailsByAsset(token, RSK_CHAIN_ID);
  const { handleSubmit, transaction } = useBridgeSend({
    sourceChain: RSK_CHAIN_ID,
    targetChain: chainId!,
    asset: token!,
    amount: parseUnits(amount || '0', assetDetails?.decimals),
    receiver,
  });

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

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translation.reviewTitle)}
      </Heading>

      <div className="bg-gray-80 border rounded border-gray-50 p-3 text-xs text-gray-30">
        {items.map(({ label, value }, index) => (
          <div
            className={classNames('flex justify-between', {
              'mb-3': index !== items.length - 1,
            })}
            key={label}
          >
            <span>{label} </span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          onClick={handleSubmit}
          loading={[
            TxStep.APPROVING,
            TxStep.CONFIRMING,
            TxStep.PENDING,
          ].includes(transaction.step)}
          className="w-full"
          dataAttribute="erc20-send-confirm"
        />
      </div>
    </div>
  );
};
