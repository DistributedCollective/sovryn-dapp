import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Icon, IconNames } from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';
import { Status, StatusEnum } from '../../../utils/boltz/boltz.types';

type BoltzStatusProps = {
  status?: Status;
};

export const BoltzStatus: FC<BoltzStatusProps> = ({ status }) => {
  const renderStatusMessage = useMemo(() => {
    switch (status) {
      case StatusEnum.set:
        return t(translations.boltz.send.boltzStatus.invoiceSet);
      case StatusEnum.pending:
        return t(translations.boltz.send.boltzStatus.invoicePending);
      case StatusEnum.paid:
        return t(translations.boltz.send.boltzStatus.invoicePaid);
      case StatusEnum.settled:
        return t(translations.boltz.send.boltzStatus.invoiceSettled);
      case StatusEnum.expired:
        return t(translations.boltz.send.boltzStatus.invoiceExpired);
      case StatusEnum.failedToPay:
        return t(translations.boltz.send.boltzStatus.invoiceFailedToPay);
      case StatusEnum.swapCreated:
        return t(translations.boltz.send.boltzStatus.swapCreated);
      case StatusEnum.swapExpired:
        return t(translations.boltz.send.boltzStatus.swapExpired);
      case StatusEnum.txMempool:
        return t(translations.boltz.send.boltzStatus.txMempool);
      case StatusEnum.txConfirmed:
        return t(translations.boltz.send.boltzStatus.txConfirmed);
      case StatusEnum.txClaimed:
        return t(translations.boltz.send.boltzStatus.txClaimed);
      case StatusEnum.txFailed:
        return t(translations.boltz.send.boltzStatus.txFailed);
      case StatusEnum.txLockupFailed:
        return t(translations.boltz.send.boltzStatus.txLockupFailed);
      case StatusEnum.txRefunded:
        return t(translations.boltz.send.boltzStatus.txRefunded);
      case StatusEnum.minerFeePaid:
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
          StatusEnum.paid,
          StatusEnum.txClaimed,
          StatusEnum.txRefunded,
        ].includes(status as StatusEnum),
        'text-danger': [
          StatusEnum.failedToPay,
          StatusEnum.expired,
          StatusEnum.swapExpired,
          StatusEnum.txFailed,
          StatusEnum.txLockupFailed,
        ].includes(status as StatusEnum),
      })}
    >
      {renderStatusMessage}
    </div>
  );
};
