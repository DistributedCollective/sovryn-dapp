import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { getProtocolContract } from '@sovryn/contracts';
import {
  Button,
  ButtonStyle,
  FormGroup,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  Select,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../../config/chains';

import { translations } from '../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import { ProposalCreationStep } from '../../../../contexts/ProposalContext.types';
import { DEFAULT_PARAMETER } from '../../NewProposalForm.constants';
import { Governor } from '../../NewProposalForm.types';
import { isValidParameter } from './ParametersStep.utils';
import { Parameter } from './components/Parameter/Parameter';

type ParametersStepProps = {
  updateConfirmButtonState: (value: boolean) => void;
  onPreview: () => void;
};

export const ParametersStep: FC<ParametersStepProps> = ({
  updateConfirmButtonState,
  onPreview,
}) => {
  const { governor, setGovernor, parameters, setParameters, submit, setStep } =
    useProposalContext();

  const [governorOwner, setGovernorOwner] = useState('');
  const [governorAdmin, setGovernorAdmin] = useState('');

  const GOVERNOR_OPTIONS = useMemo(
    () => [
      {
        value: governorAdmin,
        label: t(translations.proposalPage.governorAdmin),
      },
      {
        value: governorOwner,
        label: t(translations.proposalPage.governorOwner),
      },
    ],
    [governorAdmin, governorOwner],
  );

  useEffect(() => {
    if (!parameters || parameters.length === 0) {
      setParameters([{ ...DEFAULT_PARAMETER }]);
    }
  }, [parameters, setParameters]);

  const isConfirmDisabled = useMemo(
    () => !parameters.every(isValidParameter) || !governor,
    [parameters, governor],
  );

  const handleBack = useCallback(
    () => setStep(ProposalCreationStep.Details),
    [setStep],
  );

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

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  useEffect(() => {
    Promise.all([
      getProtocolContract(Governor.Owner, RSK_CHAIN_ID),
      getProtocolContract(Governor.Admin, RSK_CHAIN_ID),
    ]).then(([owner, admin]) => {
      setGovernorOwner(owner.address);
      setGovernorAdmin(admin.address);
    });
  }, [setGovernor]);

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

      <FormGroup
        label={
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(translations.proposalPage.governor)}
          </Paragraph>
        }
        labelElement="div"
      >
        <Select
          value={governor || ''}
          onChange={setGovernor}
          options={GOVERNOR_OPTIONS}
          className="w-full"
        />
      </FormGroup>

      {parameters.map((item, index) => (
        <Parameter parameter={item} key={index} />
      ))}

      <Button
        text={`+ ${t(translations.proposalPage.actions.add)}`}
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
