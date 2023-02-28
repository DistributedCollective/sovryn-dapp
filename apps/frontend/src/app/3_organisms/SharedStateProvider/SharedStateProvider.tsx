import React, { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../hooks/useAccount';
import {
  sharedState,
  FastBtcDialogState,
} from '../../../store/rxjs/shared-state';
import { FastBtcDialog } from '../FastBtcDialog/FastBtcDialog';

export const SharedStateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();

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

  // Close the dialog if there is no wallet connected
  useEffect(() => {
    if (fastBtcDialog.isOpen && !account) {
      handleFastBtcDialogClose();
    }
  }, [account, fastBtcDialog.isOpen, handleFastBtcDialogClose]);

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
