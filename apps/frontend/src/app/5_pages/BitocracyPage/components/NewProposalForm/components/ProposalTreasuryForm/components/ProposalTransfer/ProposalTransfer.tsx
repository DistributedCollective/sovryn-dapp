import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import {
  FormGroup,
  Input,
  AmountInput,
  Select,
  Button,
  ButtonStyle,
  Paragraph,
  ParagraphSize,
  Icon,
  IconNames,
} from '@sovryn/ui';

import { defaultChainId } from '../../../../../../../../../config/chains';

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { isAddress } from '../../../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useMaxAssetBalance } from '../../../../../../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../../../../../../locales/i18n';
import { PROPOSAL_TREASURY_OPTIONS } from '../../ProposalTreasuryForm.constants';
import {
  ProposalTransferData,
  ProposalTransferType,
} from '../../ProposalTreasuryForm.types';

type ProposalTransferProps = {
  index: number;
  transfer: ProposalTransferData;
  onChange: (
    fieldName: string,
    value: string | SupportedTokens | ProposalTransferType,
  ) => void;
  onRemove: () => void;
  onError: (error: boolean) => void;
};

export const ProposalTransfer: FC<ProposalTransferProps> = ({
  index,
  transfer,
  onChange,
  onRemove,
  onError,
}) => {
  const { account } = useAccount();
  const { balance: userBalance } = useMaxAssetBalance(
    transfer.token,
    defaultChainId,
  );

  const tokenOptions = useMemo(
    () =>
      SupportedTokenList.map(token => ({
        value: token.symbol,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token.symbol}
            assetClassName="font-medium"
          />
        ),
      })),
    [],
  );

  const getAssetRenderer = useCallback(
    (token: SupportedTokens) => (
      <AssetRenderer showAssetLogo asset={token} assetClassName="font-medium" />
    ),
    [],
  );

  const isValidAddress = useMemo(
    () =>
      isAddress(transfer.recipientAddress) ||
      transfer.recipientAddress.length === 0,
    [transfer.recipientAddress],
  );

  const errorAddressMessage = useMemo(() => {
    if (!isValidAddress && !isAddress(transfer.recipientAddress)) {
      return t(
        translations.bitocracyPage.proposalTreasuryForm.invalidRecipientAddress,
      );
    }
    return '';
  }, [isValidAddress, transfer.recipientAddress]);

  const errorAmountMessage = useMemo(() => {
    if (Number(transfer.amount) > Number(userBalance)) {
      return t(
        translations.bitocracyPage.proposalTreasuryForm.invalidAmountError,
      );
    }
    return '';
  }, [transfer.amount, userBalance]);

  const maximumAmount = useMemo(
    () => (account ? userBalance : ''),
    [userBalance, account],
  );

  useEffect(() => {
    onError(Number(transfer.amount) > Number(userBalance));
  }, [transfer.amount, userBalance, onError]);

  return (
    <div className="bg-gray-90 rounded p-3 gap-3 flex flex-col">
      <FormGroup
        label={
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(translations.bitocracyPage.proposalTreasuryForm.treasuryAccount)}
          </Paragraph>
        }
        labelElement="div"
        className="w-full"
        dataAttribute="proposal-treasury-treasury-account"
      >
        <div className="flex justify-between items-center">
          <Select
            value={transfer.treasuryType}
            onChange={value =>
              onChange(ProposalTransferType.treasuryType, value)
            }
            options={PROPOSAL_TREASURY_OPTIONS}
            className="w-full"
            dataAttribute={`proposal-treasury-${transfer.treasuryType}`}
          />
          {index > 0 && (
            <Button
              onClick={onRemove}
              text={<Icon className="mx-4" icon={IconNames.X_MARK} />}
              style={ButtonStyle.ghost}
              className="text-sov-white ml-2 opacity-80 hover:opacity-100"
            />
          )}
        </div>
      </FormGroup>

      <FormGroup
        label={
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(
              translations.bitocracyPage.proposalTreasuryForm.recipientAddress,
            )}
          </Paragraph>
        }
        labelElement="div"
        className="w-full"
        dataAttribute="proposal-treasury-recipient-address"
        errorLabel={errorAddressMessage}
      >
        <Input
          value={transfer.recipientAddress}
          onChangeText={value =>
            onChange(ProposalTransferType.recipientAddress, value)
          }
          dataAttribute="proposal-treasury-recipient-input"
          classNameInput="min-h-10"
          className="max-w-full"
        />
      </FormGroup>

      <FormGroup
        className="w-full mt-1"
        dataAttribute="proposal-treasury-amount"
        errorLabel={errorAmountMessage}
      >
        <div className="w-full flex flex-row justify-end mb-1">
          <MaxButton
            onClick={() =>
              onChange(ProposalTransferType.amount, userBalance.toString())
            }
            value={maximumAmount}
            token={transfer.token}
            dataAttribute="earn-max-button"
          />
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <AmountInput
            value={transfer.amount}
            onChangeText={value => onChange(ProposalTransferType.amount, value)}
            min={0}
            label={t(translations.common.amount)}
            className="w-full flex-grow-0 flex-shrink"
            placeholder="0"
          />
          <Select
            value={transfer.token}
            onChange={value => onChange(ProposalTransferType.token, value)}
            options={tokenOptions}
            labelRenderer={() => getAssetRenderer(transfer.token)}
            className="min-w-[6.7rem] sm:ml-0 ml-3"
            dataAttribute="proposal-treasury-token"
          />
        </div>
      </FormGroup>
    </div>
  );
};
