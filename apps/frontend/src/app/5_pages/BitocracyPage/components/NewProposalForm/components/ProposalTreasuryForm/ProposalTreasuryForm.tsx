import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { getProtocolContract } from '@sovryn/contracts';
import { Button, ButtonStyle, Icon, IconNames } from '@sovryn/ui';

import { defaultChainId } from '../../../../../../../config/chains';

import { isAddress } from '../../../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm.utils';
import { translations } from '../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import { ProposalCreationStep } from '../../../../contexts/ProposalContext.types';
import {
  ProposalTransferData,
  ProposalTransferType,
} from './ProposalTreasuryForm.types';
import { ProposalTransfer } from './components/ProposalTransfer/ProposalTransfer';
import { useInitialTransferState } from './hooks/useInitialTransferState';

type ProposalTreasuryFormProps = {
  value: ProposalTransferData[];
};

export const ProposalTreasuryForm: FC<ProposalTreasuryFormProps> = ({
  value,
}) => {
  const { setTreasuryDetails, setStep } = useProposalContext();
  const [maxAmountError, setMaxAmountError] = useState(false);
  const initialTransfer = useInitialTransferState();

  const handleBack = useCallback(
    () => setStep(ProposalCreationStep.Details),
    [setStep],
  );

  const [transfers, setTransfers] = useState(value);
  console.log('transfers', transfers);

  const isValidTransfer = useCallback(
    (transfer: ProposalTransferData) => {
      return (
        transfer.treasuryType &&
        isAddress(transfer.recipientAddress) &&
        Number(transfer.amount) > 0 &&
        !maxAmountError
      );
    },
    [maxAmountError],
  );

  const isConfirmDisabled = useMemo(
    () => !transfers.every(isValidTransfer),
    [transfers, isValidTransfer],
  );

  const handleAddTransfer = useCallback(
    () => setTransfers([...transfers, initialTransfer]),
    [transfers, initialTransfer],
  );

  const removeTransfer = useCallback(
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
      updatedTransfers[index] = {
        ...updatedTransfers[index],
        [fieldName]: value,
      };

      if (fieldName === ProposalTransferType.treasuryType) {
        const contract = await getProtocolContract(value, defaultChainId);
        updatedTransfers[index][ProposalTransferType.treasuryTypeContract] =
          contract.address;
      }

      setTransfers(updatedTransfers);
    },
    [transfers],
  );

  useEffect(() => {
    if (transfers.length) {
      setTreasuryDetails(transfers);
    } else {
      setTransfers([initialTransfer]);
      setTreasuryDetails([initialTransfer]);
    }
  }, [setTreasuryDetails, transfers, initialTransfer]);

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
          onRemove={() => removeTransfer(index)}
          onChange={(fieldName, value) =>
            handleTransferChange(index, fieldName, value)
          }
          index={index}
          onError={setMaxAmountError}
        />
      ))}

      <Button
        text={`+ ${t(translations.bitocracyPage.proposalTreasuryForm.add)}`}
        className="m-auto"
        style={ButtonStyle.secondary}
        onClick={handleAddTransfer}
      />

      <div className="flex items-center gap-4">
        <Button
          text={t(translations.bitocracyPage.actions.preview)}
          style={ButtonStyle.secondary}
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
