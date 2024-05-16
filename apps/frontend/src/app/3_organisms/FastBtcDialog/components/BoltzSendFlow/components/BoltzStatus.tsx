import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Icon, IconNames } from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';

export enum BoltzStatusType {
  invoiceSet = 'invoice.set',
  txConfirmed = 'transaction.confirmed',
  txPending = 'transaction.pending',
  txPaid = 'transaction.paid',
  txClaimed = 'transaction.claimed',
  // todo: add failed statuses?
}

type BoltzStatusProps = {
  status?: BoltzStatusType;
};

export const BoltzStatus: FC<BoltzStatusProps> = ({ status }) => {
  const renderStatusMessage = useMemo(() => {
    switch (status) {
      case BoltzStatusType.invoiceSet:
        return t(translations.boltz.send.boltzStatus.invoiceSet);
      case BoltzStatusType.txPending:
        return t(translations.boltz.send.boltzStatus.txPending);
      case BoltzStatusType.txConfirmed:
        return t(translations.boltz.send.boltzStatus.txConfirmed);
      case BoltzStatusType.txPaid:
        return t(translations.boltz.send.boltzStatus.txPaid);
      case BoltzStatusType.txClaimed:
        return t(translations.boltz.send.boltzStatus.txClaimed);
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
          BoltzStatusType.txPaid,
          BoltzStatusType.txClaimed,
        ].includes(status),
      })}
    >
      {renderStatusMessage}
    </div>
  );
};
