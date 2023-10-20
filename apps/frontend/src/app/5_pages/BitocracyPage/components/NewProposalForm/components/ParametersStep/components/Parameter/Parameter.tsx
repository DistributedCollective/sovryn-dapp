import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  FormGroup,
  Icon,
  IconNames,
  Input,
  Paragraph,
  ParagraphSize,
  Select,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../../../contexts/NewProposalContext';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';
import { PROPOSAL_CONTRACT_OPTIONS } from '../../../../NewProposalForm.constants';
import { CUSTOM_OPTION } from '../../ParametersStep.constants';
import {
  getParameterOptions,
  isValidParameter,
  renderCalldata,
  renderSignature,
} from '../../ParametersStep.utils';
import { useGetCurrentParameterValue } from './hooks/useGetCurrentParameterValue';

const contractOptions = [...PROPOSAL_CONTRACT_OPTIONS, ...CUSTOM_OPTION];

type ParameterProps = {
  parameter: ProposalCreationParameter;
};

export const Parameter: FC<ParameterProps> = ({ parameter }) => {
  const { parameters, setParameters, governor } = useProposalContext();

  console.log('parameter', parameters);

  const { parameterValue, contractAddress } = useGetCurrentParameterValue(
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

  const handleDeleteClick = useCallback(() => {
    const updatedParameters = parameters.filter(
      item =>
        item?.parametersStepExtraData?.index !==
        parameter?.parametersStepExtraData?.index,
    );

    setParameters(updatedParameters);
  }, [parameter?.parametersStepExtraData?.index, parameters, setParameters]);

  const updateParameters = useCallback(
    updatedProperties => {
      const updatedParameters = parameters.map(item => {
        if (
          item?.parametersStepExtraData?.index ===
          parameter?.parametersStepExtraData?.index
        ) {
          return {
            ...item,
            ...updatedProperties,
          };
        }
        return item;
      });

      setParameters(updatedParameters);
    },
    [parameter?.parametersStepExtraData?.index, parameters, setParameters],
  );

  const onChangeProperty = useCallback(
    (propertyName: string, value: string) => {
      updateParameters({ [propertyName]: value });
    },
    [updateParameters],
  );

  const onChangeExtraProperty = useCallback(
    (propertyName: string, value: string) => {
      if (propertyName === 'functionName') {
        updateParameters({
          parametersStepExtraData: {
            ...parameter.parametersStepExtraData,
            [propertyName]: value,
            parameterName: '',
            newValue: '',
          },
        });
      } else {
        updateParameters({
          parametersStepExtraData: {
            ...parameter.parametersStepExtraData,
            [propertyName]: value,
          },
        });
      }
    },
    [updateParameters, parameter],
  );

  const customParameterSection = useMemo(
    () => (
      <div className="gap-3 flex flex-col">
        <FormGroup
          label={
            <Paragraph size={ParagraphSize.base} className="font-medium">
              {t(translations.proposalPage.customContract.value)}
            </Paragraph>
          }
          labelElement="div"
        >
          <Input
            value={parameter.value}
            onChangeText={value => onChangeProperty('value', value)}
            className="max-w-none"
            classNameInput="h-10"
          />
        </FormGroup>

        <FormGroup
          label={
            <Paragraph size={ParagraphSize.base} className="font-medium">
              {t(translations.proposalPage.customContract.signature)}
            </Paragraph>
          }
          labelElement="div"
        >
          <Input
            value={parameter.signature}
            onChangeText={value => onChangeProperty('signature', value)}
            className="max-w-none"
            classNameInput="h-10"
          />
        </FormGroup>

        <FormGroup
          label={
            <Paragraph size={ParagraphSize.base} className="font-medium">
              {t(translations.proposalPage.customContract.calldata)}
            </Paragraph>
          }
          labelElement="div"
        >
          <Input
            value={parameter.calldata}
            onChangeText={value => onChangeProperty('calldata', value)}
            className="max-w-none"
            classNameInput="h-10"
          />
        </FormGroup>
      </div>
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
      <div className="gap-3 flex flex-col">
        <FormGroup
          label={
            <Paragraph size={ParagraphSize.base} className="font-medium">
              {t(translations.proposalPage.customContract.address)}
            </Paragraph>
          }
          labelElement="div"
        >
          <Input
            value={parameter.target}
            onChangeText={value => onChangeProperty('target', value)}
            className="max-w-none"
            classNameInput="h-10"
          />
        </FormGroup>

        {customParameterSection}
      </div>
    ),
    [customParameterSection, onChangeProperty, parameter.target],
  );

  useEffect(() => {
    const { functionName, newValue, parameterName } =
      parameter.parametersStepExtraData || {};
    const customContract = functionName === 'custom';
    const customParameter = parameterName === 'custom';
    if (functionName && !customContract && !customParameter) {
      const signature = renderSignature(functionName);
      if (parameter.signature !== signature) {
        onChangeProperty('signature', signature);
      }
    }
    if (
      isValidParameter(parameter) &&
      functionName &&
      !customContract &&
      newValue &&
      contractAddress
    ) {
      const calldata = renderCalldata(contractAddress, newValue);
      if (parameter.calldata !== calldata) {
        onChangeProperty('calldata', calldata);
      }
    }
  }, [onChangeProperty, parameter, governor, contractAddress]);

  return (
    <div className="p-3 rounded bg-gray-90 gap-6 flex flex-col">
      <FormGroup
        label={
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(translations.proposalPage.contract)}
          </Paragraph>
        }
        labelElement="div"
      >
        <div className="flex items-center">
          <Select
            value={parameter?.parametersStepExtraData?.functionName || ''}
            onChange={value => onChangeExtraProperty('functionName', value)}
            options={contractOptions}
            className="w-full"
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

      {isCustomContract ? (
        customContractSection
      ) : (
        <FormGroup
          label={
            <Paragraph size={ParagraphSize.base} className="font-medium">
              {t(translations.proposalPage.parameter)}
            </Paragraph>
          }
          labelElement="div"
        >
          <Select
            value={parameter?.parametersStepExtraData?.parameterName || ''}
            onChange={value => onChangeExtraProperty('parameterName', value)}
            options={parameterOptions}
            className="w-full mb-6"
          />

          {isCustomParameter ? (
            customParameterSection
          ) : (
            <div className="gap-6 flex flex-col mt-6">
              <SimpleTable className="min-h-10 justify-center">
                <SimpleTableRow
                  label={t(translations.proposalPage.currentValue)}
                  value={parameterValue}
                  className="flex justify-between"
                />
              </SimpleTable>

              <FormGroup
                label={
                  <Paragraph size={ParagraphSize.base} className="font-medium">
                    {t(translations.proposalPage.newValue)}
                  </Paragraph>
                }
                labelElement="div"
              >
                <Input
                  value={parameter.parametersStepExtraData?.newValue}
                  onChangeText={value =>
                    onChangeExtraProperty('newValue', value)
                  }
                  className="max-w-none"
                  classNameInput="h-10"
                />
              </FormGroup>
            </div>
          )}
        </FormGroup>
      )}
    </div>
  );
};
