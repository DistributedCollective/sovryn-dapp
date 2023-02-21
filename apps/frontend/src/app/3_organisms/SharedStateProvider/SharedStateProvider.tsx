import React, { useCallback, useEffect, useState } from 'react';

import {
  sharedState,
  FastBtcDialogState,
} from '../../../store/rxjs/shared-state';
import { FastBtcDialog } from '../FastBtcDialog/FastBtcDialog';

export const SharedStateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [fastBtcDialog, setFastBtcDialog] = useState<FastBtcDialogState>(
    sharedState.get().fastBtcDialog,
  );

  useEffect(() => {
    const fastBtcDialogSubscription = sharedState
      .select('fastBtcDialog')
      .subscribe(setFastBtcDialog);

    return () => {
      fastBtcDialogSubscription.unsubscribe();
    };
  }, []);

  const handleFastBtcDialogClose = useCallback(
    () => sharedState.actions.closeFastBtcDialog(),
    [],
  );

  return (
    <>
      {children}

      <FastBtcDialog
        isOpen={fastBtcDialog.isOpen}
        shouldHideSend={fastBtcDialog.shouldHideSend}
        onClose={handleFastBtcDialogClose}
      />
    </>
  );
};
