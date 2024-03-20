import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

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

import { RSK_CHAIN_ID } from '../../../../../../../../../config/chains';

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { isAddress } from '../../../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../../../locales/i18n';
import {
  COMMON_SYMBOLS,
  compareAssets,
  listAssetsOfChain,
} from '../../../../../../../../../utils/asset';
import { decimalic } from '../../../../../../../../../utils/math';
import { useProposalContext } from '../../../../../../contexts/NewProposalContext';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';
import { Governor } from '../../../../NewProposalForm.types';
import { TREASURY_OPTIONS } from '../../TreasuryStep.constants';
import { TreasuryParameterType } from '../../TreasuryStep.types';
import { useGetTokenDetails } from '../../hooks/useGetTokenDetails';
import {
  renderCalldata,
  renderSignature,
  isValidParameter,
} from './Parameter.utils';

type ParameterProps = {
  parameter: ProposalCreationParameter;
  onError: (error: boolean) => void;
  governorAdmin: string;
  governorOwner: string;
};

const pageTranslations = translations.bitocracyPage.proposalTreasuryForm;

export const Parameter: FC<ParameterProps> = ({
  parameter,
  onError,
  governorAdmin,
  governorOwner,
}) => {
  const { parameters, setParameters, governor } = useProposalContext();
  const [filteredOptions, setFilteredOptions] = useState(TREASURY_OPTIONS);

  const { account } = useAccount();
  const { assetBalance, assetAddress } = useGetTokenDetails(
    parameter.treasuryStepExtraData?.token || COMMON_SYMBOLS.BTC,
    parameter.target,
  );

  const tokenOptions = useMemo(
    () =>
      listAssetsOfChain(RSK_CHAIN_ID)
        .filter(token => !compareAssets(token.symbol, COMMON_SYMBOLS.WBTC))
        .map(token => ({
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

  const isValidAddress = useMemo(() => {
    const recipientAddress =
      parameter.treasuryStepExtraData?.recipientAddress || '';
    return recipientAddress === '' || !!isAddress(recipientAddress);
  }, [parameter.treasuryStepExtraData?.recipientAddress]);

  const errorAddressMessage = useMemo(() => {
    if (!isValidAddress) {
      return t(pageTranslations.invalidRecipientAddress);
    }
    return '';
  }, [isValidAddress]);

  const errorAmountMessage = useMemo(() => {
    if (decimalic(parameter?.treasuryStepExtraData?.amount).gt(assetBalance)) {
      return t(pageTranslations.invalidAmountError);
    }
    return '';
  }, [parameter?.treasuryStepExtraData?.amount, assetBalance]);

  const maximumAmount = useMemo(
    () => (account ? assetBalance : 0),
    [assetBalance, account],
  );

  const handleDeleteClick = useCallback(() => {
    const updatedParameters = parameters.filter(
      item =>
        item?.treasuryStepExtraData?.index !==
        parameter?.treasuryStepExtraData?.index,
    );

    setParameters(updatedParameters);
  }, [parameter?.treasuryStepExtraData?.index, parameters, setParameters]);

  const onChangeProperty = useCallback(
    (propertyName: string, value: string) => {
      const updatedParameters = parameters.map(item => {
        if (
          item?.treasuryStepExtraData?.index ===
          parameter?.treasuryStepExtraData?.index
        ) {
          return { ...item, [propertyName]: value };
        }
        return item;
      });

      setParameters(updatedParameters);
    },
    [parameter?.treasuryStepExtraData?.index, parameters, setParameters],
  );

  const onChangeExtraProperty = useCallback(
    (propertyName: string, value: string) => {
      const updatedParameters = parameters.map(item => {
        if (
          item?.treasuryStepExtraData?.index ===
          parameter?.treasuryStepExtraData?.index
        ) {
          return {
            ...item,
            treasuryStepExtraData: {
              ...item?.treasuryStepExtraData,
              [propertyName]: value,
            },
          };
        }
        return item;
      });

      setParameters(updatedParameters);
    },
    [parameter?.treasuryStepExtraData?.index, parameters, setParameters],
  );

  useEffect(() => {
    if (governor === governorOwner) {
      const updatedOptions = TREASURY_OPTIONS.filter(
        option => option.governor !== Governor.Admin,
      );
      setFilteredOptions(updatedOptions);
    } else if (governor === governorAdmin) {
      const updatedOptions = TREASURY_OPTIONS.filter(
        option => option.governor !== Governor.Owner,
      );
      setFilteredOptions(updatedOptions);
    }
  }, [
    governor,
    setFilteredOptions,
    governorOwner,
    governorAdmin,
    onChangeProperty,
    parameter.target,
  ]);

  useEffect(() => {
    const { token, amount, recipientAddress } =
      parameter.treasuryStepExtraData || {};

    if (token) {
      const signature = renderSignature(token);
      if (parameter.signature !== signature) {
        onChangeProperty('signature', signature);
      }

      if (isValidParameter(parameter, isValidAddress)) {
        let calldata: string;

        if (token === COMMON_SYMBOLS.BTC) {
          calldata = renderCalldata(recipientAddress || '', amount || '0');
        } else {
          calldata = renderCalldata(
            recipientAddress || '',
            amount || '0',
            assetAddress,
          );
        }

        if (parameter.calldata !== calldata) {
          onChangeProperty('calldata', calldata);
        }
      }
    }
  }, [onChangeProperty, parameter, isValidAddress, assetAddress]);

  useEffect(() => {
    onError(
      decimalic(parameter?.treasuryStepExtraData?.amount).gt(assetBalance),
    );
  }, [parameter?.treasuryStepExtraData?.amount, assetBalance, onError]);

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
            options={filteredOptions}
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
          value={parameter.treasuryStepExtraData?.recipientAddress}
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
            onClick={() =>
              onChangeExtraProperty(
                TreasuryParameterType.amount,
                assetBalance.toString(),
              )
            }
            value={maximumAmount}
            token={parameter.treasuryStepExtraData?.token || COMMON_SYMBOLS.BTC}
            dataAttribute="proposal-treasury-max-button"
            label={t(pageTranslations.accountBalance)}
          />
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <AmountInput
            value={parameter.treasuryStepExtraData?.amount}
            onChangeText={value =>
              onChangeExtraProperty(TreasuryParameterType.amount, value)
            }
            min={0}
            label={t(translations.common.amount)}
            className="w-full flex-grow-0 flex-shrink"
          />
          <Select
            value={parameter.treasuryStepExtraData?.token || COMMON_SYMBOLS.BTC}
            onChange={value =>
              onChangeExtraProperty(TreasuryParameterType.token, value)
            }
            options={tokenOptions}
            labelRenderer={({ value }) => (
              <AssetRenderer
                dataAttribute="proposal-treasury-asset"
                showAssetLogo
                asset={value}
                assetClassName="font-medium"
              />
            )}
            className="min-w-[6.7rem] sm:ml-0 ml-3"
            menuClassName="max-h-72 sm:max-h-56"
            dataAttribute="proposal-treasury-token"
          />
        </div>
      </FormGroup>
    </div>
  );
};
