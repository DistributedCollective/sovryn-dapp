import React, { useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Icon,
  IconNames,
  Paragraph,
} from '@sovryn/ui';
import { Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { BITCOIN } from '../../../../../../constants/currencies';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { getRskExplorerUrl } from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';

const translation = translations.boltz.receive.confirmationScreens;

const rskExplorerUrl = getRskExplorerUrl();

type ReviewScreenProps = {
  to: string;
  amount: string;
  receiveAmount: Decimalish;
  onConfirm: () => void;
  networkFee: Decimalish;
  conversionFee: Decimalish;
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  amount,
  onConfirm,
  receiveAmount,
  to,
  networkFee,
  conversionFee,
}) => {
  const { checkMaintenance, States } = useMaintenance();
  const boltzLocked = checkMaintenance(States.BOLTZ_RECEIVE);

  const items = useMemo(
    () => [
      {
        label: t(translation.to),
        value: (
          <TxIdWithNotification
            value={to}
            href={`${rskExplorerUrl}/address/${to}`}
          />
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <>
            {formatValue(receiveAmount, 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.conversionFee),
        value: (
          <AmountRenderer
            value={conversionFee}
            suffix={BITCOIN}
            precision={8}
          />
        ),
      },
      {
        label: t(translation.networkFee),
        value: (
          <AmountRenderer value={networkFee} suffix={BITCOIN} precision={8} />
        ),
      },
      {
        label: t(translation.amountSent),
        value: (
          <>
            {formatValue(Number(amount), 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.lightningInvoice),
        value: <Icon icon={IconNames.PENDING} />,
      },
      {
        label: t(translation.rootstockTx),
        value: <Icon icon={IconNames.PENDING} />,
      },
    ],
    [to, receiveAmount, conversionFee, networkFee, amount],
  );

  return (
    <div className="text-center">
      <Paragraph className="mb-8">{t(translation.description)}</Paragraph>

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
        {boltzLocked ? (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.boltz)}
          />
        ) : (
          <Button
            text={t(translations.common.buttons.confirm)}
            onClick={onConfirm}
            disabled={boltzLocked}
            className="w-full"
            dataAttribute="funding-send-confirm"
          />
        )}
      </div>
    </div>
  );
};
