import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';

const pageTranslations = translations.proposalPage.executableDetails;

type ExecutableDetailsProps = {
  className?: string;
  proposal: Proposal;
};

export const ExecutableDetails: FC<ExecutableDetailsProps> = ({ proposal }) => {
  const executableList = useMemo(
    () =>
      proposal.signatures.map((signature, i) => ({
        signature: signature.split('(')[0],
        target: proposal.targets[i],
        value: proposal.values[i],
        calldata: proposal.calldatas[i],
      })),
    [
      proposal.calldatas,
      proposal.signatures,
      proposal.targets,
      proposal.values,
    ],
  );
  return (
    <div className="bg-gray-90 p-6 rounded">
      <Heading className="text-sm font-medium">
        {t(pageTranslations.title)}
      </Heading>
      <div className="py-1 mt-2 flex flex-wrap gap-16">
        {executableList.map((executable, i) => (
          <div
            key={executable.signature}
            className="w-80 font-medium bg-gray-80 p-3 rounded"
          >
            <Heading className="text-xs">
              {t(pageTranslations.executable)} #{i + 1}
            </Heading>

            <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
              <Paragraph size={ParagraphSize.base} className="text-xs">
                {t(pageTranslations.assetName)}
              </Paragraph>
              <Paragraph
                size={ParagraphSize.base}
                className="text-xs text-right"
              >
                -
              </Paragraph>
            </div>

            <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
              <Paragraph size={ParagraphSize.base} className="text-xs">
                {t(pageTranslations.assetAmount)}
              </Paragraph>
              <Paragraph
                size={ParagraphSize.base}
                className="text-xs text-right"
              >
                {executable.value}
              </Paragraph>
            </div>

            <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
              <Paragraph size={ParagraphSize.base} className="text-xs">
                {t(pageTranslations.assetAddress)}
              </Paragraph>
              <Paragraph
                size={ParagraphSize.base}
                className="text-xs text-right"
              >
                -
              </Paragraph>
            </div>

            <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
              <Paragraph size={ParagraphSize.base} className="text-xs">
                {t(pageTranslations.contractAddress)}
              </Paragraph>
              <div className="text-xs text-right">
                <TxIdWithNotification
                  href=""
                  value={executable.target}
                  dataAttribute="proposal-contract-address-id"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
              <Paragraph size={ParagraphSize.base} className="text-xs">
                {t(pageTranslations.recipientAddress)}
              </Paragraph>
              <Paragraph
                size={ParagraphSize.base}
                className="text-xs text-right"
              >
                -
              </Paragraph>
            </div>

            <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
              <Paragraph size={ParagraphSize.base} className="text-xs">
                {t(pageTranslations.functionName)}
              </Paragraph>
              <Paragraph
                size={ParagraphSize.base}
                className="text-xs text-right break-all"
              >
                {executable.signature}
              </Paragraph>
            </div>

            <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
              <Paragraph size={ParagraphSize.base} className="text-xs">
                {t(pageTranslations.data)}
              </Paragraph>
              <Paragraph
                size={ParagraphSize.base}
                className="text-xs text-right break-all"
              >
                {executable.calldata}
              </Paragraph>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
