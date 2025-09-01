import React, { FC } from 'react';

import classNames from 'classnames';
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
      <Heading
        type={HeadingType.h2}
        className={classNames('font-medium', {
          'mb-12': !!status,
          'mb-8': !status,
        })}
      >
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
