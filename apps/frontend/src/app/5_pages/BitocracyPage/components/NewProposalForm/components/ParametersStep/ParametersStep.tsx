import React, { FC, useCallback, useEffect } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  FormGroup,
  Icon,
  IconNames,
  Select,
} from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import { ProposalCreationParameter } from '../../../../contexts/ProposalContext.types';
import { GOVERNOR_OPTIONS } from '../../NewProposalForm.constants';
import { Parameter } from './components/Parameter/Parameter';

const DEFAULT_PARAMETER: ProposalCreationParameter = {
  target: '',
  value: '0x0',
  signature: '',
  calldata: '0x0',
  parametersStepExtraData: {
    functionName: '',
    newValue: '',
    index: 1,
  },
};

type ParametersStepProps = {
  onBack: () => void;
};

export const ParametersStep: FC<ParametersStepProps> = ({ onBack }) => {
  const { governor, setGovernor, parameters, setParameters } =
    useProposalContext();

  useEffect(() => {
    if (!parameters || parameters.length === 0) {
      setParameters([{ ...DEFAULT_PARAMETER }]);
    }
  }, [parameters, setParameters]);

  const handleAddClick = useCallback(() => {
    const lastParameterIndex =
      parameters[parameters.length - 1]?.parametersStepExtraData?.index!;

    const updatedParameters = [
      ...parameters,
      {
        ...DEFAULT_PARAMETER,
        parametersStepExtraData: {
          ...DEFAULT_PARAMETER.parametersStepExtraData,
          index: lastParameterIndex + 1,
        },
      },
    ];

    setParameters(updatedParameters);
  }, [parameters, setParameters]);

  return (
    <div>
      <Button
        onClick={onBack}
        style={ButtonStyle.ghost}
        className="text-gray-10 inline-flex justify-start items-center text-base font-medium cursor-pointer mb-4"
        text={
          <>
            <Icon size={12} icon={IconNames.ARROW_LEFT} className="mr-2" />
            {t(translations.common.buttons.back)}
          </>
        }
      />

      <FormGroup label={t(translations.proposalPage.governor)}>
        <Select
          value={governor || ''}
          onChange={setGovernor}
          options={GOVERNOR_OPTIONS}
          className="w-full"
        />
      </FormGroup>

      {parameters.map(item => (
        <Parameter parameter={item} />
      ))}

      <Button text={'Add'} onClick={handleAddClick} />
    </div>
  );
};
