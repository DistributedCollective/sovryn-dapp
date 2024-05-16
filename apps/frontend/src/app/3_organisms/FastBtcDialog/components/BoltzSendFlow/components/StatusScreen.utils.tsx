import React from 'react';

import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { StatusIcon } from '../../../../../2_molecules/StatusIcon/StatusIcon';
import { translations } from '../../../../../../locales/i18n';
import { Status, BoltzTxStatus } from '../../../utils/boltz/boltz.types';

const translation = translations.boltz.send.confirmationScreens;

export const getTitle = (txStatus: StatusType, boltzStatus: Status) => {
  const failedTx = [
    BoltzTxStatus.failedToPay,
    BoltzTxStatus.txLockupFailed,
    BoltzTxStatus.txFailed,
  ].includes(boltzStatus as BoltzTxStatus);

  if (txStatus === StatusType.pending) {
    return t(translation.titles.pending);
  }

  if (!boltzStatus) {
    return t(translation.titles.default);
  }
  if (txStatus === StatusType.error || failedTx) {
    return t(translation.titles.error);
  }

  if (
    txStatus === StatusType.success &&
    [
      BoltzTxStatus.paid,
      BoltzTxStatus.txClaimed,
      BoltzTxStatus.settled,
    ].includes(boltzStatus as BoltzTxStatus)
  ) {
    return t(translation.titles.success);
  }

  return t(translation.titles.pending);
};

export const getDescription = (txStatus: StatusType, boltzStatus: Status) => {
  const failedTx = [
    BoltzTxStatus.failedToPay,
    BoltzTxStatus.txLockupFailed,
    BoltzTxStatus.txFailed,
  ].includes(boltzStatus as BoltzTxStatus);

  if (txStatus === StatusType.pending) {
    return (
      <StatusIcon
        status={StatusType.pending}
        dataAttribute="funding-send-status"
      />
    );
  }

  if (txStatus === StatusType.idle || !boltzStatus) {
    return t(translation.descriptions.default);
  }

  if (txStatus === StatusType.error || failedTx) {
    return (
      <StatusIcon
        status={StatusType.error}
        dataAttribute="funding-send-status"
      />
    );
  }

  if (
    txStatus === StatusType.success &&
    [
      BoltzTxStatus.paid,
      BoltzTxStatus.txClaimed,
      BoltzTxStatus.settled,
    ].includes(boltzStatus as BoltzTxStatus)
  ) {
    return (
      <StatusIcon
        status={StatusType.success}
        dataAttribute="funding-send-status"
      />
    );
  }

  return (
    <StatusIcon
      status={StatusType.pending}
      dataAttribute="funding-send-status"
    />
  );
};
