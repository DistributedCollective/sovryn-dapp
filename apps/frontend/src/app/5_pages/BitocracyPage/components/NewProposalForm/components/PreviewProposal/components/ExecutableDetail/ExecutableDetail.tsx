import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { TxIdWithNotification } from '../../../../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { ProposalRenderDetail } from '../../../../../../../../3_organisms/ProposalExecutableDetails/components/ProposalRenderDetail/ProposalRenderDetail';
import { translations } from '../../../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../../../contexts/NewProposalContext';
import {
  ProposalCreationParameter,
  ProposalCreationStep,
} from '../../../../../../contexts/ProposalContext.types';
import { TREASURY_OPTIONS } from '../../../TreasuryStep/TreasuryStep.constants';

type ExecutableDetailProps = {
  parameter: ProposalCreationParameter;
  index: number;
};

const pageTranslations = translations.proposalPage.executableDetails;

export const ExecutableDetail: FC<ExecutableDetailProps> = ({
  parameter,
  index,
}) => {
  const { step } = useProposalContext();
  const {
    treasuryStepExtraData,
    parametersStepExtraData,
    target,
    value,
    signature,
    calldata,
  } = parameter;
  const { functionName, parameterName, newValue } =
    parametersStepExtraData || {};
  const { recipientAddress, token, amount } = treasuryStepExtraData || {};
  const isTreasuryStep = useMemo(
    () => step === ProposalCreationStep.Treasury,
    [step],
  );
  const treasuryOption = useMemo(
    () => TREASURY_OPTIONS.find(option => option.value === target),
    [target],
  );

  const renderCustomValue = useCallback(() => {
    if (functionName === 'custom' || parameterName === 'custom') {
      return (
        <ProposalRenderDetail
          label={t(pageTranslations.value)}
          content={value || '-'}
        />
      );
    }
    return null;
  }, [functionName, parameterName, value]);

  const renderParameterDetails = useCallback(
    () => (
      <>
        <ProposalRenderDetail
          label={t(pageTranslations.contract)}
          content={functionName}
          className="font-medium text-gray-10"
        />
        <ProposalRenderDetail
          label={`${t(pageTranslations.parameter)} #${index + 1}`}
          content={parameterName}
          className="font-medium text-gray-10"
        />
        {target && (
          <ProposalRenderDetail
            label={t(pageTranslations.contractAddress)}
            content={
              <TxIdWithNotification
                href=""
                value={target}
                dataAttribute="proposal-contract-address-id"
              />
            }
          />
        )}
        {renderCustomValue()}
        {newValue && (
          <ProposalRenderDetail
            label={t(pageTranslations.newValue)}
            content={newValue}
          />
        )}
        <ProposalRenderDetail
          label={t(pageTranslations.functionName)}
          content={signature || '-'}
          className="break-all"
        />
      </>
    ),
    [
      index,
      functionName,
      parameterName,
      target,
      renderCustomValue,
      newValue,
      signature,
    ],
  );

  const renderTreasuryDetails = useCallback(
    () => (
      <>
        <ProposalRenderDetail
          label={t(pageTranslations.contract)}
          content={treasuryOption?.label || ''}
          className="font-medium text-gray-10"
        />
        {recipientAddress && (
          <ProposalRenderDetail
            label={t(pageTranslations.recipientAddress)}
            content={
              <TxIdWithNotification
                href=""
                value={recipientAddress}
                dataAttribute="proposal-contract-address-id"
              />
            }
          />
        )}
        <ProposalRenderDetail
          label={t(pageTranslations.assetName)}
          content={<AssetRenderer asset={token} className="justify-end m-0" />}
        />
        <ProposalRenderDetail
          label={t(pageTranslations.amount)}
          content={amount}
        />
        <ProposalRenderDetail
          label={t(pageTranslations.signature)}
          content={signature || '-'}
          className="break-all"
        />
      </>
    ),
    [recipientAddress, treasuryOption, token, amount, signature],
  );

  return (
    <div className="w-full font-medium bg-gray-80 p-3 rounded text-gray-30">
      {isTreasuryStep ? renderTreasuryDetails() : renderParameterDetails()}
      <ProposalRenderDetail
        label={t(pageTranslations.calldata)}
        content={calldata}
        className="break-all"
      />
    </div>
  );
};
