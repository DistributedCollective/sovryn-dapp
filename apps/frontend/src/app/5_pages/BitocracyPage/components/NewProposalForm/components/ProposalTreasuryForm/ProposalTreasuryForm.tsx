import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { getProtocolContract } from '@sovryn/contracts';
import { Button, ButtonStyle, Icon, IconNames } from '@sovryn/ui';

import { defaultChainId } from '../../../../../../../config/chains';

import { isAddress } from '../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { translations } from '../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import {
  ProposalCreationParameter,
  ProposalCreationStep,
} from '../../../../contexts/ProposalContext.types';
import { ProposalParameterType } from './ProposalTreasuryForm.types';
import { ProposalParameter } from './components/ProposalParameter/ProposalParameter';
import { useInitialParameterState } from './hooks/useInitialParameterState';

type ProposalTreasuryFormProps = {
  onPreview: () => void;
};

export const ProposalTreasuryForm: FC<ProposalTreasuryFormProps> = ({
  onPreview,
}) => {
  const { setParameters, setStep, parameters } = useProposalContext();
  const [maxAmountError, setMaxAmountError] = useState(false);
  const initialParameter = useInitialParameterState();

  const isValidParameter = useCallback(
    (parameter: ProposalCreationParameter) => {
      return (
        parameter.parametersStepExtraData?.treasuryType &&
        isAddress(parameter.parametersStepExtraData.recipientAddress || '') &&
        Number(parameter.parametersStepExtraData.amount) > 0 &&
        !maxAmountError
      );
    },
    [maxAmountError],
  );

  const isConfirmDisabled = useMemo(
    () => !parameters.every(isValidParameter),
    [parameters, isValidParameter],
  );

  const handleAddClick = useCallback(() => {
    const lastParameter = parameters[parameters.length - 1];
    const nextIndex = (lastParameter?.parametersStepExtraData?.index || 0) + 1;

    const newParameter = {
      ...initialParameter,
      parametersStepExtraData: {
        ...initialParameter.parametersStepExtraData,
        index: nextIndex,
      },
    };

    setParameters([...parameters, newParameter]);
  }, [parameters, initialParameter, setParameters]);

  const handleDeleteClick = useCallback(
    (index: number) => {
      const updatedParameters = [...parameters];
      updatedParameters.splice(index, 1);
      setParameters(updatedParameters);
    },
    [parameters, setParameters],
  );

  const handleChangeClick = useCallback(
    async (index: number, fieldName: string, value: string) => {
      const updatedParameters = [...parameters];
      updatedParameters[index].parametersStepExtraData = {
        ...updatedParameters[index].parametersStepExtraData,
        [fieldName]: value,
      };

      if (fieldName === ProposalParameterType.treasuryType) {
        const contract = await getProtocolContract(value, defaultChainId);
        updatedParameters[index].parametersStepExtraData = {
          ...updatedParameters[index].parametersStepExtraData,
          treasuryTypeContract: contract.address,
        };
      }

      setParameters(updatedParameters);
    },
    [parameters, setParameters],
  );

  const handleBack = useCallback(
    () => setStep(ProposalCreationStep.Details),
    [setStep],
  );

  useEffect(() => {
    if (parameters.length === 0) {
      setParameters([initialParameter]);
    }
  }, [parameters, initialParameter, setParameters]);

  return (
    <div className="flex flex-col gap-7 relative pb-4">
      <Button
        onClick={handleBack}
        style={ButtonStyle.ghost}
        className="text-gray-10 inline-flex justify-start items-center text-base font-medium cursor-pointer"
        text={
          <>
            <Icon size={12} icon={IconNames.ARROW_LEFT} className="mr-2" />
            {t(translations.common.buttons.back)}
          </>
        }
      />

      {parameters.map((parameter, index) => (
        <ProposalParameter
          key={index}
          parameter={parameter}
          onRemove={() => handleDeleteClick(index)}
          onChange={(fieldName, value) =>
            handleChangeClick(index, fieldName, value)
          }
          parametersLength={parameters.length}
          onError={setMaxAmountError}
        />
      ))}

      <Button
        text={`+ ${t(translations.bitocracyPage.proposalTreasuryForm.add)}`}
        className="m-auto"
        style={ButtonStyle.secondary}
        onClick={handleAddClick}
      />

      <div className="flex items-center gap-4">
        <Button
          text={t(translations.bitocracyPage.actions.preview)}
          style={ButtonStyle.secondary}
          onClick={onPreview}
          className="flex-1"
        />
        <Button
          text={t(translations.common.buttons.confirm)}
          disabled={isConfirmDisabled}
          className="flex-1"
        />
      </div>
    </div>
  );
};
