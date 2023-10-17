import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { getProtocolContract } from '@sovryn/contracts';
import { Button, ButtonStyle, Icon, IconNames } from '@sovryn/ui';

import { isAddress } from '../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { translations } from '../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import {
  ProposalCreationParameter,
  ProposalCreationStep,
} from '../../../../contexts/ProposalContext.types';
import { ProposalTreasuryParameterType } from './ProposalTreasuryForm.types';
import { Parameter } from './components/Parameter/Parameter';
import { useParameterState } from './hooks/useParameterState';

type ProposalTreasuryFormProps = {
  onPreview: () => void;
  updateConfirmButtonState: (value: boolean) => void;
};

export const ProposalTreasuryForm: FC<ProposalTreasuryFormProps> = ({
  onPreview,
  updateConfirmButtonState,
}) => {
  const { setParameters, setStep, parameters, submit } = useProposalContext();
  const [maxAmountError, setMaxAmountError] = useState(false);
  const initialParameter = useParameterState();
  console.log('parameters', parameters);

  const isValidParameter = useCallback(
    (parameter: ProposalCreationParameter) => {
      return (
        parameter.parametersStepExtraData?.treasuryType &&
        isAddress(parameter.parametersStepExtraData.recipientAddress || '') &&
        Number(parameter.value) > 0 &&
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

  const handleChange = useCallback(
    async (index: number, fieldName: string, value: string) => {
      const updatedParameters = [...parameters];
      updatedParameters[index].parametersStepExtraData = {
        ...updatedParameters[index].parametersStepExtraData,
        [fieldName]: value,
      };

      updatedParameters[index] = {
        ...updatedParameters[index],
        [fieldName]: value,
      };

      if (fieldName === ProposalTreasuryParameterType.treasuryType) {
        const contract = await getProtocolContract(value);
        updatedParameters[index] = {
          ...updatedParameters[index],
          target: contract.address,
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

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  useEffect(() => {
    if (parameters.length === 0) {
      setParameters([initialParameter]);
    }
  }, [parameters, initialParameter, setParameters]);

  useEffect(() => {
    updateConfirmButtonState(isConfirmDisabled);
  }, [isConfirmDisabled, updateConfirmButtonState]);

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
        <Parameter
          key={index}
          parameter={parameter}
          onRemove={() => handleDeleteClick(index)}
          onChange={(fieldName, value) => handleChange(index, fieldName, value)}
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
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};
