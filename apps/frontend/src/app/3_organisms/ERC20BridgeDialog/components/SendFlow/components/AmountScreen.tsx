import React, { useCallback, useContext, useEffect } from 'react';

import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

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
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { translations } from '../../../../../../locales/i18n';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { useBridgeService } from '../../../hooks/useBridgeService';
import { useBridgeValidation } from '../../../hooks/useBridgeValidation';
import { useERC20BridgeLocked } from '../../../hooks/useERC20BridgeLocked';
import { useTokenBalance } from '../../../hooks/useTokenBalance';

export const AmountScreen: React.FC = () => {
  const { account } = useAccount();
  const { set, token, chainId, amount, receiver } = useContext(SendFlowContext);
  const bridgeService = useBridgeService();
  const assetDetails = useTokenDetailsByAsset(token, RSK_CHAIN_ID);
  const { data: tokenBalance } = useTokenBalance(token, RSK_CHAIN_ID);
  const isBridgeLocked = useERC20BridgeLocked();

  const balance = formatUnits(tokenBalance || '0', assetDetails?.decimals);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: SendFlowStep.REVIEW })),
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
    sourceChain: RSK_CHAIN_ID,
    targetChain: chainId!,
    asset: token!,
    amount: parseUnits(amount || '0', assetDetails?.decimals).toString(),
    receiver,
  });

  return (
    <div>
      {chainId && (
        <Paragraph className="flex text-base font-medium items-center mb-6 gap-2">
          <>
            {t(translations.erc20Bridge.mainScreen.sending)}{' '}
            {bridgeService.getNetworkConfig(RSK_CHAIN_ID)?.name}
            <Icon icon={IconNames.ARROW_RIGHT} size={12} />
            {bridgeService.getNetworkConfig(chainId)?.name}
          </>
        </Paragraph>
      )}

      <div className="w-full flex flex-row justify-between items-center mb-1">
        <Paragraph className="text-sm font-medium">
          {t(translations.erc20Bridge.mainScreen.tabs.sendLabel)}
        </Paragraph>

        {token && balance && (
          <MaxButton
            onClick={onMaximumAmountClick}
            value={balance || '0'}
            token={token}
            dataAttribute="bridge-from-max"
            chainId={RSK_CHAIN_ID}
          />
        )}
      </div>

      <AmountInput
        value={amount}
        onChangeText={setAmount}
        label={t(translations.common.amount)}
        unit={token}
        min={0}
        className="w-full mb-6 max-w-full"
        placeholder="0"
      />

      <Paragraph className="mb-1 text-sm font-medium">
        <Trans
          i18nKey={t(translations.erc20Bridge.send.addressLabel, {
            network: bridgeService.getNetworkConfig(chainId!)?.name,
          })}
        />
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
        message={<Trans i18nKey={t(translations.erc20Bridge.send.warning)} />}
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
      ) : (
        <Button
          onClick={onContinueClick}
          text={t(translations.common.buttons.continue)}
          className="w-full mt-6"
          style={ButtonStyle.secondary}
          dataAttribute="funding-send-instructions-confirm"
          disabled={!isValid || isBridgeLocked}
        />
      )}
    </div>
  );
};
