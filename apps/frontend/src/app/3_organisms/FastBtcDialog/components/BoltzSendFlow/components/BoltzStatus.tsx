import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Icon, IconNames } from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';

export enum BoltzStatusType {
  set = 'invoice.set',
  pending = 'invoice.pending',
  paid = 'invoice.paid',
  settled = 'invoice.settled',
  expired = 'invoice.expired',
  failedToPay = 'invoice.failedToPay',
  swapCreated = 'swap.created',
  swapExpired = 'swap.expired',
  txMempool = 'transaction.mempool',
  txConfirmed = 'transaction.confirmed',
  txFailed = 'transaction.failed',
  txClaimed = 'transaction.claimed',
  txRefunded = 'transaction.refunded',
  minerFeePaid = 'minerFee.paid',
}

type BoltzStatusProps = {
  status?: BoltzStatusType;
};

export const BoltzStatus: FC<BoltzStatusProps> = ({ status }) => {
  const renderStatusMessage = useMemo(() => {
    switch (status) {
      case BoltzStatusType.set:
        return t(translations.boltz.send.boltzStatus.invoiceSet);
      case BoltzStatusType.pending:
        return t(translations.boltz.send.boltzStatus.invoicePending);
      case BoltzStatusType.paid:
        return t(translations.boltz.send.boltzStatus.invoicePaid);
      case BoltzStatusType.settled:
        return t(translations.boltz.send.boltzStatus.invoiceSettled);
      case BoltzStatusType.expired:
        return t(translations.boltz.send.boltzStatus.invoiceExpired);
      case BoltzStatusType.failedToPay:
        return t(translations.boltz.send.boltzStatus.invoiceFailedToPay);
      case BoltzStatusType.swapCreated:
        return t(translations.boltz.send.boltzStatus.swapCreated);
      case BoltzStatusType.swapExpired:
        return t(translations.boltz.send.boltzStatus.swapExpired);
      case BoltzStatusType.txMempool:
        return t(translations.boltz.send.boltzStatus.txMempool);
      case BoltzStatusType.txConfirmed:
        return t(translations.boltz.send.boltzStatus.txConfirmed);
      case BoltzStatusType.txClaimed:
        return t(translations.boltz.send.boltzStatus.txClaimed);
      case BoltzStatusType.txFailed:
        return t(translations.boltz.send.boltzStatus.txFailed);
      case BoltzStatusType.txRefunded:
        return t(translations.boltz.send.boltzStatus.txRefunded);
      case BoltzStatusType.minerFeePaid:
        return t(translations.boltz.send.boltzStatus.minerFeePaid);
      default:
        return status;
    }
  }, [status]);

  return status === undefined ? (
    <Icon icon={IconNames.PENDING} />
  ) : (
    <div
      className={classNames({
        'text-success': [
          BoltzStatusType.paid,
          BoltzStatusType.txClaimed,
          BoltzStatusType.txRefunded,
        ].includes(status),
        'text-danger': [
          BoltzStatusType.failedToPay,
          BoltzStatusType.expired,
          BoltzStatusType.swapExpired,
          BoltzStatusType.txFailed,
        ].includes(status),
      })}
    >
      {renderStatusMessage}
    </div>
  );
};
