import React from 'react';

import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { StatusIcon } from '../../../../../2_molecules/StatusIcon/StatusIcon';
import { translations } from '../../../../../../locales/i18n';
import { BoltzStatusType } from './BoltzStatus';

const translation = translations.boltz.send.confirmationScreens;

export const getTitle = (
  txStatus: StatusType,
  BoltzStatus: BoltzStatusType,
) => {
  if (!BoltzStatus) {
    return t(translation.titles.default);
  }
  if (txStatus === StatusType.error) {
    return t(translation.titles.error);
  }

  if (
    txStatus === StatusType.success &&
    [
      BoltzStatusType.paid,
      BoltzStatusType.txClaimed,
      BoltzStatusType.settled,
    ].includes(BoltzStatus)
  ) {
    return t(translation.titles.success);
  }

  return t(translation.titles.pending);
};

export const getDescription = (
  txStatus: StatusType,
  boltzStatus: BoltzStatusType,
) => {
  if (txStatus === StatusType.idle || !boltzStatus) {
    return t(translation.descriptions.default);
  }

  if (txStatus === StatusType.error) {
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
      BoltzStatusType.paid,
      BoltzStatusType.txClaimed,
      BoltzStatusType.settled,
    ].includes(boltzStatus)
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
