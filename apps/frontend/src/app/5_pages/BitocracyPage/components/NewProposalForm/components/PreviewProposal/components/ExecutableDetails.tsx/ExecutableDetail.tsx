import React, { FC } from 'react';

import { t } from 'i18next';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { TxIdWithNotification } from '../../../../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';

const pageTranslations = translations.proposalPage.executableDetails;

type ExecutableDetailsProps = {
  parameters: ProposalCreationParameter[];
};

export const ExecutableDetails: FC<ExecutableDetailsProps> = ({
  parameters,
}) => (
  <div className="bg-gray-90 p-6 rounded">
    <Heading className="text-sm font-medium">
      {t(pageTranslations.title)}
    </Heading>
    <div className="py-1 mt-2 flex flex-col flex-wrap gap-8">
      {parameters.map((parameter, i) => (
        <div
          key={parameter.signature + i}
          className="w-full font-medium bg-gray-80 p-3 rounded"
        >
          <Heading className="text-xs">
            {t(pageTranslations.executable)} #{i + 1}
          </Heading>

          <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
            <Paragraph size={ParagraphSize.base} className="text-xs">
              {t(pageTranslations.assetName)}
            </Paragraph>
            <Paragraph size={ParagraphSize.base} className="text-xs text-right">
              -
            </Paragraph>
          </div>

          <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
            <Paragraph size={ParagraphSize.base} className="text-xs">
              {t(pageTranslations.assetAmount)}
            </Paragraph>
            <Paragraph size={ParagraphSize.base} className="text-xs text-right">
              {parameter.value || '0'}
            </Paragraph>
          </div>

          <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
            <Paragraph size={ParagraphSize.base} className="text-xs">
              {t(pageTranslations.assetAddress)}
            </Paragraph>
            <Paragraph size={ParagraphSize.base} className="text-xs text-right">
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
                value={parameter.target}
                dataAttribute="proposal-contract-address-id"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
            <Paragraph size={ParagraphSize.base} className="text-xs">
              {t(pageTranslations.recipientAddress)}
            </Paragraph>
            <Paragraph size={ParagraphSize.base} className="text-xs text-right">
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
              {parameter.signature}
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
              {parameter.calldata}
            </Paragraph>
          </div>
        </div>
      ))}
    </div>
  </div>
);
