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

import { isAddress } from '../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';
import { useGetPersonalStakingStatistics } from '../../../../../StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { useGetStakingStatistics } from '../../../../../StakePage/components/StakingStatistics/hooks/useGetStakingStatistics';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import {
  ProposalCreationParameter,
  ProposalCreationStep,
} from '../../../../contexts/ProposalContext.types';
import { DEFAULT_PARAMETER } from '../../NewProposalForm.constants';
import { Governor } from '../../NewProposalForm.types';
import {
  GOVERNOR_VAULT_OWNER_ADDRESS,
  REQUIRED_VOTING_POWER,
} from './TreasuryStep.constants';
import { Parameter } from './components/Parameter/Parameter';
import { isValidParameter } from './components/Parameter/Parameter.utils';

type TreasuryStepProps = {
  onPreview: () => void;
  updateConfirmButtonState: (value: boolean) => void;
};

export const TreasuryStep: FC<TreasuryStepProps> = ({
  onPreview,
  updateConfirmButtonState,
}) => {
  const { setParameters, setStep, parameters, submit, governor, setGovernor } =
    useProposalContext();
  const [maxAmountError, setMaxAmountError] = useState(false);

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

  const { votingPower } = useGetPersonalStakingStatistics();
  const { totalVotingPower } = useGetStakingStatistics();

  const isValid = useCallback(
    (parameter: ProposalCreationParameter) =>
      isAddress(parameter?.treasuryStepExtraData?.recipientAddress || '') &&
      isValidParameter(parameter, true) &&
      !maxAmountError,
    [maxAmountError],
  );

  const hasVotingPower = useMemo(() => {
    if (votingPower && totalVotingPower) {
      const requiredVotingPower = decimalic(totalVotingPower.toString()).mul(
        REQUIRED_VOTING_POWER,
      );
      return decimalic(votingPower.toString()).gte(requiredVotingPower);
    }
    return false;
  }, [votingPower, totalVotingPower]);

  const isConfirmDisabled = useMemo(
    () => !parameters.every(isValid) || !hasVotingPower || !governor,
    [parameters, isValid, hasVotingPower, governor],
  );

  const handleAddClick = useCallback(() => {
    const lastParameter = parameters[parameters.length - 1];
    const nextIndex = (lastParameter?.treasuryStepExtraData?.index || 0) + 1;

    const newParameter = {
      ...DEFAULT_PARAMETER,
      target: GOVERNOR_VAULT_OWNER_ADDRESS || '',
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

  useEffect(() => {
    Promise.all([
      getProtocolContract(Governor.Owner, RSK_CHAIN_ID),
      getProtocolContract(Governor.Admin, RSK_CHAIN_ID),
    ]).then(([owner, admin]) => {
      setGovernorOwner(owner.address);
      setGovernorAdmin(admin.address);
    });
  }, [setGovernorOwner, setGovernorAdmin]);

  useEffect(() => {
    if (parameters.length === 1 && parameters[0].target === '') {
      setParameters([
        {
          ...parameters[0],
          target: GOVERNOR_VAULT_OWNER_ADDRESS || '',
        },
      ]);
    }
  }, [parameters, setParameters]);

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

      {parameters.map((parameter, index) => (
        <Parameter
          key={index}
          parameter={parameter}
          onError={setMaxAmountError}
          governorAdmin={governorAdmin}
          governorOwner={governorOwner}
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
