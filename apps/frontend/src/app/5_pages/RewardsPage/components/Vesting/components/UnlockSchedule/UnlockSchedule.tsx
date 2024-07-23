import React, { useEffect, useMemo, useState } from 'react';

import { Button, ButtonStyle, ButtonType } from '@sovryn/ui';

import { VestingContractTableRecord } from '../../Vesting.types';
import { vestingTypeToTitleMapping } from '../../Vestings.utils';
import { useVestingContext } from '../../context/VestingContext';
import { useGetUnlockSchedule } from '../../hooks/useGetUnlockSchedule';
import { UnlockScheduleDialog } from '../UnlockScheduleDialog/UnlockScheduleDialog';

export const UnlockSchedule = (item: VestingContractTableRecord) => {
  const update = useVestingContext().update;
  const unlockSchedule = useGetUnlockSchedule(item);

  const [showDialog, setShowDialog] = useState(false);

  const title = useMemo(
    () => vestingTypeToTitleMapping(item.type),
    [item.type],
  );

  useEffect(() => {
    update(state => {
      state.item = item;
    });
  }, [item, update]);

  return (
    <>
      <Button
        text={title}
        style={ButtonStyle.ghost}
        type={ButtonType.button}
        className="underline"
        onClick={() => setShowDialog(prevValue => !prevValue)}
      />
      <UnlockScheduleDialog
        vestingContract={item}
        unlockSchedule={unlockSchedule}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};
