import React, { useCallback, useContext, useEffect } from 'react';

import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ButtonStyle,
  ErrorBadge,
  ErrorLevel,
  ErrorList,
  Icon,
  IconNames,
  Input,
  InputSize,
  Paragraph,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { MaxButton } from '../../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../../hooks';
import { useChainStore } from '../../../../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { translations } from '../../../../../../locales/i18n';
import {
  ReceiveFlowContext,
  ReceiveFlowStep,
} from '../../../contexts/receiveflow';
import { useBridgeService } from '../../../hooks/useBridgeService';
import { useBridgeValidation } from '../../../hooks/useBridgeValidation';
import { useERC20BridgeLocked } from '../../../hooks/useERC20BridgeLocked';
import { useTokenBalance } from '../../../hooks/useTokenBalance';

export const AmountScreen: React.FC = () => {
  const { set, token, chainId, amount, receiver } =
    useContext(ReceiveFlowContext);

  const bridgeService = useBridgeService();
  const { account } = useAccount();
  const { currentChainId, setCurrentChainId } = useChainStore();
  const isWrongChain = currentChainId !== chainId;

  const { data: tokenBalance } = useTokenBalance(token, chainId);
  const assetDetails = useTokenDetailsByAsset(token, chainId);
  const balance = formatUnits(tokenBalance || '0', assetDetails?.decimals);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: ReceiveFlowStep.REVIEW })),
    [set],
  );

  const setAmount = useCallback(
    (value: string) => set(prevState => ({ ...prevState, amount: value })),
    [set],
  );
  const setReceiver = useCallback(
    (value: string) => set(prevState => ({ ...prevState, receiver: value })),
    [set],
  );

  const onMaximumAmountClick = useCallback(
    () => setAmount((balance || '0').toString()),
    [balance, setAmount],
  );

  useEffect(() => {
    if (!receiver && account) {
      setReceiver(account);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isValid, messages } = useBridgeValidation({
    sourceChain: chainId!,
    targetChain: RSK_CHAIN_ID,
    asset: token!,
    amount: parseUnits(amount || '0', assetDetails?.decimals).toString(),
    receiver,
  });

  const isBridgeLocked = useERC20BridgeLocked();

  return (
    <div>
      {chainId && (
        <Paragraph className="flex text-base font-medium items-center mb-12 gap-2">
          <>
            {t(translations.erc20Bridge.mainScreen.sending)}{' '}
            {bridgeService.getNetworkConfig(chainId)?.name}
            <Icon icon={IconNames.ARROW_RIGHT} size={12} />
            {bridgeService.getNetworkConfig(RSK_CHAIN_ID)?.name}
          </>
        </Paragraph>
      )}

      <div className="w-full flex flex-row justify-between items-center mb-1">
        <Paragraph className="text-sm font-medium">
          {t(translations.erc20Bridge.mainScreen.tabs.receiveLabel)}
        </Paragraph>

        {token && balance && (
          <MaxButton
            onClick={onMaximumAmountClick}
            value={balance || '0'}
            token={token}
            dataAttribute="bridge-from-max"
            chainId={chainId}
          />
        )}
      </div>

      <AmountInput
        value={amount}
        onChangeText={setAmount}
        label={t(translations.common.amount)}
        unit={token}
        min={0}
        className="w-full max-w-full"
        placeholder="0"
      />

      <Paragraph className="mb-1 mt-6 text-sm font-medium">
        {t(translations.erc20Bridge.receive.addressLabel)}
      </Paragraph>
      <Input
        value={receiver}
        onChangeText={setReceiver}
        className="w-full mb-6 max-w-full"
        placeholder="0x"
        size={InputSize.large}
      />

      <ErrorBadge
        level={ErrorLevel.Warning}
        message={t(translations.erc20Bridge.receive.warning)}
      />

      <ErrorList
        errors={messages.map(message => ({
          level: ErrorLevel.Critical,
          message,
        }))}
      />

      {isBridgeLocked ? (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.erc20Bridge)}
        />
      ) : isWrongChain ? (
        <Button
          onClick={() => chainId && setCurrentChainId(chainId)}
          text={t(translations.erc20Bridge.confirmationScreens.switchNetwork)}
          className="w-full mt-12"
          style={ButtonStyle.secondary}
          dataAttribute="switch-network-button"
          disabled={!token || !chainId}
        />
      ) : (
        <Button
          onClick={onContinueClick}
          text={t(translations.common.buttons.continue)}
          className="w-full mt-6"
          style={ButtonStyle.secondary}
          dataAttribute="funding-receive-instructions-confirm"
          disabled={!isValid || isBridgeLocked}
        />
      )}
    </div>
  );
};
