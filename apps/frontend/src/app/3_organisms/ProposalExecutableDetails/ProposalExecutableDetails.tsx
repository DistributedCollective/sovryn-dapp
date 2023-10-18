import React, { FC } from 'react';

import { t } from 'i18next';

import { Heading } from '@sovryn/ui';

import { TxIdWithNotification } from '../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { ProposalCreationParameter } from '../../5_pages/BitocracyPage/contexts/ProposalContext.types';
import { translations } from '../../../locales/i18n';
import { renderDetail } from './ProposalExecutableDetails.utils';

type ProposalExecutableDetailProps = {
  parameter: ProposalCreationParameter;
  index: number;
};

const pageTranslations = translations.proposalPage.executableDetails;

export const ProposalExecutableDetail: FC<ProposalExecutableDetailProps> = ({
  parameter,
  index,
}) => (
  <div className="w-full font-medium bg-gray-80 p-3 rounded">
    <Heading className="text-xs">
      {t(pageTranslations.executable)} #{index + 1}
    </Heading>

    <div className="w-full text-gray-30">
      {renderDetail(t(pageTranslations.assetName), '-', 'text-right')}
      {renderDetail(
        t(pageTranslations.assetAmount),
        parameter.value || '0',
        'text-right',
      )}
      {renderDetail(t(pageTranslations.assetAddress), '-', 'text-right')}
      {renderDetail(
        t(pageTranslations.contractAddress),
        <TxIdWithNotification
          href=""
          value={parameter.target}
          dataAttribute="proposal-contract-address-id"
        />,
        'text-right',
      )}
      {renderDetail(t(pageTranslations.recipientAddress), '-', 'text-right')}
      {renderDetail(
        t(pageTranslations.functionName),
        parameter.signature,
        'break-all text-right',
      )}
      {renderDetail(
        t(pageTranslations.data),
        parameter.calldata,
        'break-all text-right',
      )}
    </div>
  </div>
);
