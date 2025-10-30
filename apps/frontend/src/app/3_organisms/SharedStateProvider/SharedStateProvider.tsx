import React, { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../hooks/useAccount';
import {
  sharedState,
  FastBtcDialogState,
  EmailNotificationSettingsDialogState,
  RuneBridgeDialogState,
  Erc20BridgeDialogState,
} from '../../../store/rxjs/shared-state';
import { ERC20BridgeDialog } from '../ERC20BridgeDialog/ERC20BridgeDialog';
import { EmailNotificationSettingsDialog } from '../EmailNotificationSettingsDialog/EmailNotificationSettingsDialog';
import { FastBtcDialog } from '../FastBtcDialog/FastBtcDialog';
import { RuneBridgeDialog } from '../RuneBridgeDialog/RuneBridgeDialog';

export const SharedStateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();

  const [fastBtcDialog, setFastBtcDialog] = useState<FastBtcDialogState>(
    sharedState.get().fastBtcDialog,
  );

  const [runeBridgeDialog, setRuneBridgeDialog] =
    useState<RuneBridgeDialogState>(sharedState.get().runeBridgeDialog);

  const [erc20BridgeDialog, setErc20BridgeDialog] =
    useState<Erc20BridgeDialogState>(sharedState.get().erc20BridgeDialog);

  const [emailNotificationSettingsDialog, setEmailNotificationSettingsDialog] =
    useState<EmailNotificationSettingsDialogState>(
      sharedState.get().emailNotificationSettingsDialog,
    );

  useEffect(() => {
    const fastBtcDialogSubscription = sharedState
      .select('fastBtcDialog')
      .subscribe(setFastBtcDialog);

    return () => {
      fastBtcDialogSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const emailNotificationSettingsDialogSubscription = sharedState
      .select('emailNotificationSettingsDialog')
      .subscribe(setEmailNotificationSettingsDialog);

    return () => {
      emailNotificationSettingsDialogSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const runeBridgeDialogSubscription = sharedState
      .select('runeBridgeDialog')
      .subscribe(setRuneBridgeDialog);

    return () => {
      runeBridgeDialogSubscription.unsubscribe();
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

  const handleFastBtcDialogClose = useCallback(
    () => sharedState.actions.closeFastBtcDialog(),
    [],
  );

  const handleEmailNotificationSettingsDialogClose = useCallback(
    () => sharedState.actions.closeEmailNotificationSettingsDialog(),
    [],
  );

  const handleRuneBridgeDialogClose = useCallback(
    () => sharedState.actions.closeRuneBridgeDialog(),
    [],
  );

  const handleErc20BridgeDialogClose = useCallback(
    () => sharedState.actions.closeErc20BridgeDialog(),
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
        step={fastBtcDialog.step}
      />

      <EmailNotificationSettingsDialog
        isOpen={emailNotificationSettingsDialog.isOpen}
        onClose={handleEmailNotificationSettingsDialogClose}
      />

      <RuneBridgeDialog
        isOpen={runeBridgeDialog.isOpen}
        onClose={handleRuneBridgeDialogClose}
        step={runeBridgeDialog.step}
      />

      <ERC20BridgeDialog
        isOpen={erc20BridgeDialog.isOpen}
        onClose={handleErc20BridgeDialogClose}
        step={erc20BridgeDialog.step}
      />
    </>
  );
};
