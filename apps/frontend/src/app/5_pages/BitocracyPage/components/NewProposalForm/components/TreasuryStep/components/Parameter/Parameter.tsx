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

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { isAddress } from '../../../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useMaxAssetBalance } from '../../../../../../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../../../contexts/NewProposalContext';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';
import { TREASURY_OPTIONS } from '../../TreasuryStep.constants';
import { TreasuryParameterType } from '../../TreasuryStep.types';

type ParameterProps = {
  parameter: ProposalCreationParameter;
  onError: (error: boolean) => void;
};

const pageTranslations = translations.bitocracyPage.proposalTreasuryForm;

export const Parameter: FC<ParameterProps> = ({ parameter, onError }) => {
  const { parameters, setParameters } = useProposalContext();
  const { account } = useAccount();
  const { balance: userBalance } = useMaxAssetBalance(
    parameter.parametersStepExtraData?.token || SupportedTokens.rbtc,
  );

  const tokenOptions = useMemo(
    () =>
      SupportedTokenList.filter(
        token => token.symbol !== SupportedTokens.wrbtc,
      ).map(token => ({
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
    if (Number(parameter.value) > Number(userBalance)) {
      return t(pageTranslations.invalidAmountError);
    }
    return '';
  }, [parameter.value, userBalance]);

  const maximumAmount = useMemo(
    () => (account ? userBalance : 0),
    [userBalance, account],
  );

  const handleDeleteClick = useCallback(() => {
    const updatedParameters = parameters.filter(
      item =>
        item?.parametersStepExtraData?.index !==
        parameter?.parametersStepExtraData?.index,
    );

    setParameters(updatedParameters);
  }, [parameter?.parametersStepExtraData?.index, parameters, setParameters]);

  const onChangeProperty = useCallback(
    (propertyName: string, value: string) => {
      const updatedParameters = parameters.map(item => {
        if (
          item?.parametersStepExtraData?.index ===
          parameter?.parametersStepExtraData?.index
        ) {
          return { ...item, [propertyName]: value };
        }
        return item;
      });

      setParameters(updatedParameters);
    },
    [parameter?.parametersStepExtraData?.index, parameters, setParameters],
  );

  const onChangeExtraProperty = useCallback(
    (propertyName: string, value: string) => {
      const updatedParameters = parameters.map(item => {
        if (
          item?.parametersStepExtraData?.index ===
          parameter?.parametersStepExtraData?.index
        ) {
          return {
            ...item,
            parametersStepExtraData: {
              ...item?.parametersStepExtraData,
              [propertyName]: value,
            },
          };
        }
        return item;
      });

      setParameters(updatedParameters);
    },
    [parameter?.parametersStepExtraData?.index, parameters, setParameters],
  );

  useEffect(() => {
    onError(Number(parameter.value) > Number(userBalance));
  }, [parameter.value, userBalance, onError]);

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
        dataAttribute="proposal-treasury-account"
      >
        <div className="flex justify-between items-center">
          <Select
            value={parameter.target}
            onChange={value => onChangeProperty('target', value)}
            options={TREASURY_OPTIONS}
            className="w-full"
            dataAttribute="proposal-treasury-select"
          />
          {parameters.length > 1 && (
            <Button
              onClick={handleDeleteClick}
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
        dataAttribute="proposal-treasury-recipient-label"
        errorLabel={errorAddressMessage}
      >
        <Input
          value={parameter.parametersStepExtraData?.recipientAddress}
          onChangeText={value =>
            onChangeExtraProperty(TreasuryParameterType.recipientAddress, value)
          }
          dataAttribute="proposal-treasury-recipient-address"
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
            onClick={() => onChangeProperty('value', userBalance.toString())}
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
            value={parameter.value}
            onChangeText={value => onChangeProperty('value', value)}
            min={0}
            label={t(translations.common.amount)}
            className="w-full flex-grow-0 flex-shrink"
            placeholder="0"
          />
          <Select
            value={
              parameter.parametersStepExtraData?.token || SupportedTokens.rbtc
            }
            onChange={value =>
              onChangeExtraProperty(TreasuryParameterType.token, value)
            }
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
