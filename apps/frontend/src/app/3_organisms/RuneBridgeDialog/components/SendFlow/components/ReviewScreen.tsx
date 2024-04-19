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

import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../../locales/i18n';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { useSendFlowContext } from '../../../contexts/sendflow';
import { useRuneBridgeLocked } from '../../../hooks/useRuneBridgeLocked';

const translation = translations.runeBridge.send.confirmationScreens;

const rskExplorerUrl = getRskExplorerUrl();
const btcExplorerUrl = getBtcExplorerUrl();

type FeesPaid = {
  rune: number;
  baseCurrency: number;
};

type ReviewScreenProps = {
  from: string;
  to: string;
  amount: string;
  feesPaid: FeesPaid;
  receiveAmount: number;
  onConfirm: () => void;
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  amount,
  onConfirm,
  feesPaid,
  receiveAmount,
  from,
  to,
}) => {
  const runeBridgeLocked = useRuneBridgeLocked();
  const { selectedToken } = useSendFlowContext();

  const items = useMemo(
    () => [
      {
        label: t(translation.from),
        value: (
          <TxIdWithNotification
            value={from}
            href={`${rskExplorerUrl}/address/${from}`}
          />
        ),
      },
      {
        label: t(translation.to),
        value: (
          <TxIdWithNotification
            value={to}
            href={`${btcExplorerUrl}/address/${to}`}
          />
        ),
      },
      {
        label: t(translation.sending),
        value: (
          <>
            {formatValue(Number(amount), 8)} {selectedToken.symbol}
          </>
        ),
      },
      {
        label: t(translation.serviceFee),
        value: (
          <>
            {formatValue(feesPaid.rune, 8)} {selectedToken.symbol} +{' '}
            {formatValue(feesPaid.baseCurrency, 8)} BTC
          </>
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <>
            {formatValue(receiveAmount, 8)} {selectedToken.symbol}
          </>
        ),
      },
    ],
    [amount, feesPaid, from, receiveAmount, selectedToken.symbol, to],
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
          disabled={runeBridgeLocked}
          className="w-full"
          dataAttribute="funding-send-confirm"
        />
        {runeBridgeLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.runeBridge)}
          />
        )}
      </div>
    </div>
  );
};
