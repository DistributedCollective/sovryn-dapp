import React, { useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
  TransactionId,
} from '@sovryn/ui';

import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { Bitcoin } from '../../../../../../utils/constants';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';

const translation = translations.fastBtc.send.confirmationScreens;

const rskExplorerUrl = getRskExplorerUrl();
const btcExplorerUrl = getBtcExplorerUrl();

type ReviewScreenProps = {
  from: string;
  to: string;
  amount: string;
  feesPaid: number;
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
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const items = useMemo(
    () => [
      {
        label: t(translation.from),
        value: (
          <TransactionId
            value={from}
            href={`${rskExplorerUrl}/address/${from}`}
          />
        ),
      },
      {
        label: t(translation.to),
        value: (
          <TransactionId value={to} href={`${btcExplorerUrl}/address/${to}`} />
        ),
      },
      {
        label: t(translation.sending),
        value: (
          <>
            {formatValue(Number(amount), 8)} {Bitcoin}
          </>
        ),
      },
      {
        label: t(translation.serviceFee),
        value: (
          <>
            {formatValue(feesPaid, 8)} {Bitcoin}
          </>
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <>
            {formatValue(receiveAmount, 8)} {Bitcoin}
          </>
        ),
      },
    ],
    [amount, feesPaid, from, receiveAmount, to],
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
          disabled={fastBtcLocked}
          className="w-full"
          dataAttribute="funding-send-confirm"
        />
        {fastBtcLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.fastBtc)}
          />
        )}
      </div>
    </div>
  );
};
