import React, { useCallback, useContext, useMemo } from 'react';

import classNames from 'classnames';
import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { Button, Heading, HeadingType, prettyTx } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { translations } from '../../../../../../locales/i18n';
import { formatValue } from '../../../../../../utils/math';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { useBridgeLimits } from '../../../hooks/useBridgeLimits';
import { useBridgeService } from '../../../hooks/useBridgeService';

const translation = translations.erc20Bridge.confirmationScreens;

export const ReviewScreen: React.FC = () => {
  const { set, token, chainId, amount, receiver } = useContext(SendFlowContext);
  const bridgeService = useBridgeService();
  const { data: limits } = useBridgeLimits(RSK_CHAIN_ID, chainId, token);

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

  const onConfirm = useCallback(
    () => set(prevState => ({ ...prevState, step: SendFlowStep.REVIEW })),
    [set],
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
          onClick={onConfirm}
          className="w-full"
          dataAttribute="erc20-send-confirm"
        />
      </div>
    </div>
  );
};
