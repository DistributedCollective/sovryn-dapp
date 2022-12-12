import React, { FC, useState } from 'react';

import { Dialog, DialogBody, DialogHeader, DialogSize, noop } from '@sovryn/ui';

import { AdjustCreditLine } from '../../3_organisms/ZeroLocForm/AdjustCreditLine';

export const ZeroPage: FC = () => {
  const [value, setValue] = useState({
    debt: '0',
    collateral: '0',
  });

  return (
    <div className="container max-w-7xl mt-24">
      <div className="w-96">
        <Dialog width={DialogSize.sm} isOpen disableFocusTrap>
          <DialogHeader title="Adjust" onClose={noop} />
          <DialogBody>
            <AdjustCreditLine
              collateralValue={value.collateral}
              creditValue={value.debt}
              onSubmit={setValue}
            />
          </DialogBody>
        </Dialog>
      </div>
    </div>
  );
};
