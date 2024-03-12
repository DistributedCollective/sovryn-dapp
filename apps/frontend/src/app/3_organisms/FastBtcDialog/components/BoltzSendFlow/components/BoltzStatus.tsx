import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Icon, IconNames } from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';
import { Status, BoltzTxStatus } from '../../../utils/boltz/boltz.types';

type BoltzStatusProps = {
  status?: Status;
};

export const BoltzStatus: FC<BoltzStatusProps> = ({ status }) => {
  const renderStatusMessage = useMemo(() => {
    switch (status) {
      case BoltzTxStatus.set:
        return t(translations.boltz.send.boltzStatus.invoiceSet);
      case BoltzTxStatus.pending:
        return t(translations.boltz.send.boltzStatus.invoicePending);
      case BoltzTxStatus.paid:
        return t(translations.boltz.send.boltzStatus.invoicePaid);
      case BoltzTxStatus.settled:
        return t(translations.boltz.send.boltzStatus.invoiceSettled);
      case BoltzTxStatus.expired:
        return t(translations.boltz.send.boltzStatus.invoiceExpired);
      case BoltzTxStatus.failedToPay:
        return t(translations.boltz.send.boltzStatus.invoiceFailedToPay);
      case BoltzTxStatus.swapCreated:
        return t(translations.boltz.send.boltzStatus.swapCreated);
      case BoltzTxStatus.swapExpired:
        return t(translations.boltz.send.boltzStatus.swapExpired);
      case BoltzTxStatus.txMempool:
        return t(translations.boltz.send.boltzStatus.txMempool);
      case BoltzTxStatus.txConfirmed:
        return t(translations.boltz.send.boltzStatus.txConfirmed);
      case BoltzTxStatus.txClaimed:
        return t(translations.boltz.send.boltzStatus.txClaimed);
      case BoltzTxStatus.txFailed:
        return t(translations.boltz.send.boltzStatus.txFailed);
      case BoltzTxStatus.txLockupFailed:
        return t(translations.boltz.send.boltzStatus.txLockupFailed);
      case BoltzTxStatus.txRefunded:
        return t(translations.boltz.send.boltzStatus.txRefunded);
      case BoltzTxStatus.minerFeePaid:
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
          BoltzTxStatus.paid,
          BoltzTxStatus.txClaimed,
          BoltzTxStatus.txRefunded,
        ].includes(status as BoltzTxStatus),
        'text-danger': [
          BoltzTxStatus.failedToPay,
          BoltzTxStatus.expired,
          BoltzTxStatus.swapExpired,
          BoltzTxStatus.txFailed,
          BoltzTxStatus.txLockupFailed,
        ].includes(status as BoltzTxStatus),
      })}
    >
      {renderStatusMessage}
    </div>
  );
};
