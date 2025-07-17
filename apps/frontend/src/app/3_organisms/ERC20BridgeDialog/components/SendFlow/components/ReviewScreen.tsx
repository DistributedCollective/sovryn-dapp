import React, { useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
} from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';
import { formatValue } from '../../../../../../utils/math';

const translation = translations.erc20Bridge.confirmationScreens;

type ReviewScreenProps = {
  amount: string;
  onConfirm: () => void;
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  amount,
  onConfirm,
}) => {
  const erc20BridgeLocked = false;
  // const { selectedToken } = useSendFlowContext();
  // const { explorerUrl, baseCurrency } = useChainDetails();
  const items = useMemo(
    () => [
      {
        label: t(translation.amount),
        value: <>{formatValue(Number(amount), 8)}</>,
      },
      {
        label: t(translation.token),
        value: <>ETH {'->'} ETHs</>,
      },
      {
        label: t(translation.originNetwork),
        value: <>Ethereum</>,
      },
      {
        label: t(translation.destinationNetwork),
        value: <>RSK</>,
      },
      {
        label: t(translation.serviceFee),
        value: <>0.0012 ETH</>,
      },
    ],
    [amount],
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
          disabled={erc20BridgeLocked}
          className="w-full"
          dataAttribute="erc20-send-confirm"
        />
        {erc20BridgeLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.runeBridge)}
          />
        )}
      </div>
    </div>
  );
};
