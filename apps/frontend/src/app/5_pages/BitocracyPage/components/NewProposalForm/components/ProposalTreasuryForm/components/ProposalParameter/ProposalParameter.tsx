import React, { FC, useEffect, useMemo } from 'react';

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

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { isAddress } from '../../../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useMaxAssetBalance } from '../../../../../../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';
import { PROPOSAL_TREASURY_OPTIONS } from '../../ProposalTreasuryForm.constants';
import {
  ProposalParameterType,
  ProposalTreasuryType,
} from '../../ProposalTreasuryForm.types';

type ProposalParameterProps = {
  parameter: ProposalCreationParameter;
  parametersLength: number;
  onChange: (
    fieldName: string,
    value: string | SupportedTokens | ProposalParameterType,
  ) => void;
  onRemove: () => void;
  onError: (error: boolean) => void;
};

const pageTranslations = translations.bitocracyPage.proposalTreasuryForm;

export const ProposalParameter: FC<ProposalParameterProps> = ({
  parameter,
  parametersLength,
  onChange,
  onRemove,
  onError,
}) => {
  const { account } = useAccount();
  const { balance: userBalance } = useMaxAssetBalance(
    parameter.parametersStepExtraData?.token || SupportedTokens.rbtc,
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

  const isValidAddress = useMemo(
    () =>
      isAddress(parameter.parametersStepExtraData?.recipientAddress || '') ||
      !parameter.parametersStepExtraData?.recipientAddress,
    [parameter.parametersStepExtraData?.recipientAddress],
  );

  const errorAddressMessage = useMemo(() => {
    if (
      !isValidAddress &&
      !isAddress(parameter.parametersStepExtraData?.recipientAddress || '')
    ) {
      return t(pageTranslations.invalidRecipientAddress);
    }
    return '';
  }, [isValidAddress, parameter.parametersStepExtraData?.recipientAddress]);

  const errorAmountMessage = useMemo(() => {
    if (
      Number(parameter.parametersStepExtraData?.amount) > Number(userBalance)
    ) {
      return t(pageTranslations.invalidAmountError);
    }
    return '';
  }, [parameter.parametersStepExtraData?.amount, userBalance]);

  const maximumAmount = useMemo(
    () => (account ? userBalance : ''),
    [userBalance, account],
  );

  useEffect(() => {
    onError(
      Number(parameter.parametersStepExtraData?.amount) > Number(userBalance),
    );
  }, [parameter.parametersStepExtraData?.amount, userBalance, onError]);

  return (
    <div className="bg-gray-90 rounded p-3 gap-3 flex flex-col">
      <FormGroup
        label={
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(pageTranslations.treasuryAccount)}
          </Paragraph>
        }
        labelElement="div"
        className="w-full"
        dataAttribute="proposal-treasury-treasury-account"
      >
        <div className="flex justify-between items-center">
          <Select
            value={
              parameter.parametersStepExtraData?.treasuryType ||
              ProposalTreasuryType.governorVaultOwner
            }
            onChange={value =>
              onChange(ProposalParameterType.treasuryType, value)
            }
            options={PROPOSAL_TREASURY_OPTIONS}
            className="w-full"
            dataAttribute={`proposal-treasury-${
              parameter.parametersStepExtraData?.treasuryType ||
              ProposalTreasuryType.governorVaultOwner
            }`}
          />
          {parametersLength > 1 && (
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
          <Paragraph size={ParagraphSize.base} className="font-medium mt-1">
            {t(pageTranslations.recipientAddress)}
          </Paragraph>
        }
        labelElement="div"
        className="w-full"
        dataAttribute="proposal-treasury-recipient-address"
        errorLabel={errorAddressMessage}
      >
        <Input
          value={parameter.parametersStepExtraData?.recipientAddress}
          onChangeText={value =>
            onChange(ProposalParameterType.recipientAddress, value)
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
              onChange(ProposalParameterType.amount, userBalance.toString())
            }
            value={maximumAmount}
            token={
              parameter.parametersStepExtraData?.token || SupportedTokens.rbtc
            }
            dataAttribute="proposal-treasury-max-button"
            label={t(pageTranslations.accountBalance)}
          />
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <AmountInput
            value={parameter.parametersStepExtraData?.amount}
            onChangeText={value =>
              onChange(ProposalParameterType.amount, value)
            }
            min={0}
            label={t(translations.common.amount)}
            className="w-full flex-grow-0 flex-shrink"
            placeholder="0"
          />
          <Select
            value={
              parameter.parametersStepExtraData?.token || SupportedTokens.rbtc
            }
            onChange={value => onChange(ProposalParameterType.token, value)}
            options={tokenOptions}
            labelRenderer={({ value }) => (
              <AssetRenderer
                dataAttribute="proposal-treasury-asset"
                showAssetLogo
                asset={SupportedTokens[value]}
                assetClassName="font-medium"
              />
            )}
            className="min-w-[6.7rem] sm:ml-0 ml-3"
            dataAttribute="proposal-treasury-token"
          />
        </div>
      </FormGroup>
    </div>
  );
};
