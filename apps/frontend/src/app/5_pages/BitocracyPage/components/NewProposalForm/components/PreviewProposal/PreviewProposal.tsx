import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  Heading,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { TxIdWithNotification } from '../../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { ProposalInfo } from '../../../../../ProposalPage/components/ProposalInfo/ProposalInfo';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import { ProposalCreationStep } from '../../../../contexts/ProposalContext.types';
import { ExecutableDetails } from './components/ExecutableDetails.tsx/ExecutableDetail';

const pageTranslations = translations.proposalPage;

type PreviewProposalProps = {
  onClose: () => void;
  disabled?: boolean;
};

export const PreviewProposal: FC<PreviewProposalProps> = ({
  onClose,
  disabled,
}) => {
  const { details, submit, type, parameters, step } = useProposalContext();
  const { account } = useAccount();

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-20 text-left text-gray-10 mb-5 mt-2 pb-14">
        <div className="w-full flex flex-col gap-6 sm:max-h-[35rem] overflow-auto">
          <div className="md:px-6 md:pb-6">
            <Heading className="text-base sm:text-2xl font-medium break-all">
              {details.title}
            </Heading>
            <div className="mt-2.5 sm:mt-3 font-medium text-gray-30 break-words">
              {details.summary}
            </div>
            <div className="mt-2.5 sm:mt-6 text-xs font-medium text-gray-30 flex justify-between md:justify-start">
              <span className="inline-block min-w-20">
                {t(pageTranslations.proposedBy)}
              </span>

              {account && (
                <TxIdWithNotification
                  href=""
                  value={account}
                  dataAttribute="proposal-proposer-address-id"
                />
              )}
            </div>
            <Paragraph
              size={ParagraphSize.base}
              className="mt-1 text-xs font-medium text-gray-30 flex justify-between md:justify-start"
            >
              <span className="inline-block min-w-20">
                {t(pageTranslations.proposalID)}
              </span>
              <span className="text-gray-10">{`${type}-001`}</span>
            </Paragraph>
          </div>

          <ProposalInfo link={details.link} description={details.text} />
          {parameters.length > 0 && step !== ProposalCreationStep.Details && (
            <ExecutableDetails parameters={parameters} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 bg-sovryn-black p-6 pb-10 border-t sm:border-none border-gray-60 justify-center sm:absolute fixed bottom-0 left-0 right-0 z-10">
        <Button
          text={t(translations.common.buttons.back)}
          onClick={onClose}
          style={ButtonStyle.secondary}
          className="flex-1 max-w-44"
        />
        <Button
          text={t(translations.common.buttons.confirm)}
          onClick={handleSubmit}
          className="flex-1 max-w-44"
          disabled={disabled}
        />
      </div>
    </>
  );
};
