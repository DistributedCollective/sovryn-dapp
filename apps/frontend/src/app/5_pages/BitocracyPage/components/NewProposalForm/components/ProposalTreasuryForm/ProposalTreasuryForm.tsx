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
import { ProposalTransferType } from './ProposalTreasuryForm.types';
import { ProposalTransfer } from './components/ProposalTransfer/ProposalTransfer';
import { useInitialTransferState } from './hooks/useInitialTransferState';

type ProposalTreasuryFormProps = {
  onPreview: () => void;
};

export const ProposalTreasuryForm: FC<ProposalTreasuryFormProps> = ({
  onPreview,
}) => {
  const { setParameters, setStep, parameters } = useProposalContext();
  const [maxAmountError, setMaxAmountError] = useState(false);
  const initialTransfer = useInitialTransferState();

  const [transfers, setTransfers] = useState(parameters);
  console.log('transfers', transfers);

  const isValidTransfer = useCallback(
    (transfer: ProposalCreationParameter) => {
      return (
        transfer.parametersStepExtraData?.treasuryType &&
        isAddress(transfer.parametersStepExtraData.recipientAddress || '') &&
        Number(transfer.parametersStepExtraData.amount) > 0 &&
        !maxAmountError
      );
    },
    [maxAmountError],
  );

  const isConfirmDisabled = useMemo(
    () => !transfers.every(isValidTransfer),
    [transfers, isValidTransfer],
  );

  const handleAddClick = useCallback(() => {
    const lastTransfer = transfers[transfers.length - 1];
    const nextIndex = (lastTransfer?.parametersStepExtraData?.index || 0) + 1;

    const newTransfer = {
      ...initialTransfer,
      parametersStepExtraData: {
        ...initialTransfer.parametersStepExtraData,
        index: nextIndex,
      },
    };

    setTransfers([...transfers, newTransfer]);
  }, [transfers, initialTransfer]);

  const handleRemoveClick = useCallback(
    (index: number) => {
      const updatedTransfers = [...transfers];
      updatedTransfers.splice(index, 1);
      setTransfers(updatedTransfers);
    },
    [transfers],
  );

  const handleTransferChange = useCallback(
    async (index: number, fieldName: string, value: string) => {
      const updatedTransfers = [...transfers];
      updatedTransfers[index].parametersStepExtraData = {
        ...updatedTransfers[index].parametersStepExtraData,
        [fieldName]: value,
      };

      if (fieldName === ProposalTransferType.treasuryType) {
        const contract = await getProtocolContract(value, defaultChainId);
        updatedTransfers[index].parametersStepExtraData = {
          ...updatedTransfers[index].parametersStepExtraData,
          treasuryTypeContract: contract.address,
        };
      }

      setTransfers(updatedTransfers);
    },
    [transfers],
  );

  const handleBack = useCallback(
    () => setStep(ProposalCreationStep.Details),
    [setStep],
  );

  useEffect(() => {
    if (transfers.length) {
      setParameters(transfers);
    } else {
      setTransfers([initialTransfer]);
      setParameters([initialTransfer]);
    }
  }, [setParameters, transfers, initialTransfer]);

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

      {transfers.map((transfer, index) => (
        <ProposalTransfer
          key={index}
          transfer={transfer}
          onRemove={() => handleRemoveClick(index)}
          onChange={(fieldName, value) =>
            handleTransferChange(index, fieldName, value)
          }
          transfersLength={transfers.length}
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
