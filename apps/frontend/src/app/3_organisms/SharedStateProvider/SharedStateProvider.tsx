import React, { useCallback, useEffect, useState } from 'react';

import {
  sharedState,
  EmailNotificationSettingsDialogState,
  Erc20BridgeDialogState,
} from '../../../store/rxjs/shared-state';
import { ERC20BridgeDialog } from '../ERC20BridgeDialog/ERC20BridgeDialog';
import { EmailNotificationSettingsDialog } from '../EmailNotificationSettingsDialog/EmailNotificationSettingsDialog';

export const SharedStateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [erc20BridgeDialog, setErc20BridgeDialog] =
    useState<Erc20BridgeDialogState>(sharedState.get().erc20BridgeDialog);

  const [emailNotificationSettingsDialog, setEmailNotificationSettingsDialog] =
    useState<EmailNotificationSettingsDialogState>(
      sharedState.get().emailNotificationSettingsDialog,
    );

  useEffect(() => {
    const emailNotificationSettingsDialogSubscription = sharedState
      .select('emailNotificationSettingsDialog')
      .subscribe(setEmailNotificationSettingsDialog);

    return () => {
      emailNotificationSettingsDialogSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const erc20BridgeDialogSubscription = sharedState
      .select('erc20BridgeDialog')
      .subscribe(setErc20BridgeDialog);

    return () => {
      erc20BridgeDialogSubscription.unsubscribe();
    };
  }, []);

  const handleEmailNotificationSettingsDialogClose = useCallback(
    () => sharedState.actions.closeEmailNotificationSettingsDialog(),
    [],
  );

  const handleErc20BridgeDialogClose = useCallback(
    () => sharedState.actions.closeErc20BridgeDialog(),
    [],
  );

  return (
    <>
      {children}

      <EmailNotificationSettingsDialog
        isOpen={emailNotificationSettingsDialog.isOpen}
        onClose={handleEmailNotificationSettingsDialogClose}
      />

      <ERC20BridgeDialog
        isOpen={erc20BridgeDialog.isOpen}
        onClose={handleErc20BridgeDialogClose}
        step={erc20BridgeDialog.step}
      />
    </>
  );
};
