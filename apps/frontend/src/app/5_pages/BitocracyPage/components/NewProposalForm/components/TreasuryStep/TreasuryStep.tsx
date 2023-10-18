import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, Icon, IconNames } from '@sovryn/ui';

import { isAddress } from '../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { translations } from '../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import {
  ProposalCreationParameter,
  ProposalCreationStep,
} from '../../../../contexts/ProposalContext.types';
import { DEFAULT_PARAMETER } from './TreasuryStep.constants';
import { Parameter } from './components/Parameter/Parameter';

type TreasuryStepProps = {
  onPreview: () => void;
  updateConfirmButtonState: (value: boolean) => void;
};

export const TreasuryStep: FC<TreasuryStepProps> = ({
  onPreview,
  updateConfirmButtonState,
}) => {
  const { setParameters, setStep, parameters, submit } = useProposalContext();
  const [maxAmountError, setMaxAmountError] = useState(false);
  console.log('parameters', parameters);

  const isValidParameter = useCallback(
    (parameter: ProposalCreationParameter) =>
      isAddress(parameter?.treasuryStepExtraData?.recipientAddress || '') &&
      Number(parameter?.treasuryStepExtraData?.amount) > 0 &&
      !maxAmountError,
    [maxAmountError],
  );

  const isConfirmDisabled = useMemo(
    () => !parameters.every(isValidParameter),
    [parameters, isValidParameter],
  );

  const handleAddClick = useCallback(() => {
    const lastParameter = parameters[parameters.length - 1];
    const nextIndex = (lastParameter?.treasuryStepExtraData?.index || 0) + 1;

    const newParameter = {
      ...DEFAULT_PARAMETER,
      treasuryStepExtraData: {
        ...DEFAULT_PARAMETER.treasuryStepExtraData,
        index: nextIndex,
      },
    };

    setParameters([...parameters, newParameter]);
  }, [parameters, setParameters]);

  const handleBack = useCallback(
    () => setStep(ProposalCreationStep.Details),
    [setStep],
  );

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  useEffect(() => {
    if (parameters.length === 0) {
      setParameters([DEFAULT_PARAMETER]);
    }
  }, [parameters, setParameters]);

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
