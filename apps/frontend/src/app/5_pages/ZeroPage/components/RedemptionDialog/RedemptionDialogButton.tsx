import React, { FC } from 'react';

import classNames from 'classnames';

import { Button } from '@sovryn/ui';

import { useRedemptionDialog } from './useRedemptionDialog';

export const RedemptionDialogButton: FC = () => {
  const { setOpen } = useRedemptionDialog();
  return (
    <div className={classNames('flex justify-center md:justify-end mb-9')}>
      <Button
        className="flex-1 md:flex-initial max-w-[20.5rem] md:max-w-none "
        onClick={() => setOpen(true)}
        text={'Redemption'}
        dataAttribute="zero-loc-open"
      />
    </div>
  );
};
