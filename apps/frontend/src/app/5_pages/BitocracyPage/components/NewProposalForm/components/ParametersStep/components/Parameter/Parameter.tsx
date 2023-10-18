import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import {
  FormGroup,
  Icon,
  IconNames,
  Input,
  Select,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../../../contexts/NewProposalContext';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';
import { PROPOSAL_CONTRACT_OPTIONS } from '../../../../NewProposalForm.constants';
import { CUSTOM_OPTION } from '../../ParametersStep.constants';
import { getParameterOptions } from '../../ParametersStep.utils';
import { useGetCurrentParameterValue } from './hooks/useGetCurrentParameterValue';

const contractOptions = [...PROPOSAL_CONTRACT_OPTIONS, ...CUSTOM_OPTION];

type ParameterProps = {
  parameter: ProposalCreationParameter;
};

export const Parameter: FC<ParameterProps> = ({ parameter }) => {
  const { parameters, setParameters } = useProposalContext();

  const parameterValue = useGetCurrentParameterValue(
    parameter?.parametersStepExtraData?.parameterName || '',
    parameter?.parametersStepExtraData?.functionName || '',
  );

  const parameterOptions = useMemo(
    () => [
      ...getParameterOptions(
        parameter?.parametersStepExtraData?.functionName || '',
      ),
      ...CUSTOM_OPTION,
    ],
    [parameter?.parametersStepExtraData?.functionName],
  );

  const isCustomContract = useMemo(
    () => parameter?.parametersStepExtraData?.functionName === 'custom',
    [parameter?.parametersStepExtraData?.functionName],
  );

  const isCustomParameter = useMemo(
    () => parameter?.parametersStepExtraData?.parameterName === 'custom',
    [parameter?.parametersStepExtraData?.parameterName],
  );

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

  const handleDeleteClick = useCallback(() => {
    const updatedParameters = parameters.filter(
      item =>
        item?.parametersStepExtraData?.index !==
        parameter?.parametersStepExtraData?.index,
    );

    setParameters(updatedParameters);
  }, [parameter?.parametersStepExtraData?.index, parameters, setParameters]);

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

  const customParameterSection = useMemo(
    () => (
      <>
        <FormGroup
          label={t(translations.proposalPage.customContract.value)}
          className="mt-4"
        >
          <Input
            value={parameter.value}
            onChangeText={value => onChangeProperty('value', value)}
          />
        </FormGroup>

        <FormGroup
          label={t(translations.proposalPage.customContract.signature)}
          className="mt-4"
        >
          <Input
            value={parameter.signature}
            onChangeText={value => onChangeProperty('signature', value)}
          />
        </FormGroup>

        <FormGroup
          label={t(translations.proposalPage.customContract.calldata)}
          className="mt-4"
        >
          <Input
            value={parameter.calldata}
            onChangeText={value => onChangeProperty('calldata', value)}
          />
        </FormGroup>
      </>
    ),
    [
      onChangeProperty,
      parameter.calldata,
      parameter.signature,
      parameter.value,
    ],
  );

  const customContractSection = useMemo(
    () => (
      <>
        <FormGroup
          label={t(translations.proposalPage.customContract.address)}
          className="mt-4"
        >
          <Input
            value={parameter.target}
            onChangeText={value => onChangeProperty('target', value)}
          />
        </FormGroup>

        {customParameterSection}
      </>
    ),
    [customParameterSection, onChangeProperty, parameter.target],
  );

  return (
    <div className="p-3 mt-4 rounded bg-gray-90">
      <FormGroup label={t(translations.proposalPage.contract)}>
        <div className="flex items-center">
          <Select
            value={parameter?.parametersStepExtraData?.functionName || ''}
            onChange={value => onChangeExtraProperty('functionName', value)}
            options={contractOptions}
            className="w-full"
          />
          <div onClick={handleDeleteClick} className="cursor-pointer ml-4">
            <Icon icon={IconNames.X_MARK} size={12} />
          </div>
        </div>
      </FormGroup>

      {isCustomContract ? (
        customContractSection
      ) : (
        <FormGroup
          label={t(translations.proposalPage.parameter)}
          className="mt-6"
        >
          <Select
            value={parameter?.parametersStepExtraData?.parameterName || ''}
            onChange={value => onChangeExtraProperty('parameterName', value)}
            options={parameterOptions}
            className="w-full"
          />

          {isCustomParameter ? (
            customParameterSection
          ) : (
            <>
              <SimpleTable className="mt-8">
                <SimpleTableRow
                  label={t(translations.proposalPage.currentValue)}
                  value={parameterValue}
                  className="flex justify-between"
                />
              </SimpleTable>

              <div className="flex items-center justify-between mt-4">
                <div className="whitespace-nowrap mr-4">
                  {t(translations.proposalPage.newValue)}
                </div>
                <Input
                  value={parameter.parametersStepExtraData?.newValue}
                  onChangeText={value =>
                    onChangeExtraProperty('newValue', value)
                  }
                  className="max-w-none"
                />
              </div>
            </>
          )}
        </FormGroup>
      )}
    </div>
  );
};
