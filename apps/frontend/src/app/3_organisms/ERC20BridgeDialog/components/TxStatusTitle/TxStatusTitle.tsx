import React, { FC } from 'react';

import { t } from 'i18next';

import { BridgeTransaction } from '@sovryn/sdk';
import { Heading, HeadingType } from '@sovryn/ui';

import { StatusIcon } from '../../../../2_molecules/StatusIcon/StatusIcon';
import { getStatus } from './TxStatusTitle.utils';

export const TxStatusTitle: FC<Pick<BridgeTransaction, 'step'>> = ({
  step,
}) => {
  const { title, status } = getStatus(step);

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(title)}
      </Heading>

      {status && (
        <div className="mb-8">
          <StatusIcon status={status} />
        </div>
      )}
    </>
  );
};
