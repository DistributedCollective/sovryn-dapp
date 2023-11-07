import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Heading } from '@sovryn/ui';

import { TxIdWithNotification } from '../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { ProposalCreationParameter } from '../../5_pages/BitocracyPage/contexts/ProposalContext.types';
import { translations } from '../../../locales/i18n';
import { ProposalRenderDetail } from './components/ProposalRenderDetail/ProposalRenderDetail';

const TREASURY_PROPOSAL_SIGNATURES = ['transferRbtc', 'transferTokens'];

type ProposalExecutableDetailProps = {
  parameter: ProposalCreationParameter;
  index: number;
};

const pageTranslations = translations.proposalPage.executableDetails;

export const ProposalExecutableDetail: FC<ProposalExecutableDetailProps> = ({
  parameter,
  index,
}) => {
  const isTreasuryProposalParameter = useMemo(
    () => TREASURY_PROPOSAL_SIGNATURES.includes(parameter.signature),
    [parameter.signature],
  );

  return (
    <div className="w-full font-medium bg-gray-80 p-3 rounded">
      <Heading className="text-xs">
        {t(pageTranslations.executable)} #{index + 1}
      </Heading>

      <div className="w-full text-gray-30">
        {isTreasuryProposalParameter && (
          <>
            <ProposalRenderDetail
              label={t(pageTranslations.assetName)}
              content={'-'}
            />
            <ProposalRenderDetail
              label={t(pageTranslations.assetAmount)}
              content={parameter.value || '0'}
            />
            <ProposalRenderDetail
              label={t(pageTranslations.assetAddress)}
              content={'-'}
            />
          </>
        )}

        <ProposalRenderDetail
          label={t(pageTranslations.contractAddress)}
          content={
            <TxIdWithNotification
              href=""
              value={parameter.target}
              dataAttribute="proposal-contract-address-id"
            />
          }
        />

        {isTreasuryProposalParameter && (
          <ProposalRenderDetail
            label={t(pageTranslations.recipientAddress)}
            content={'-'}
          />
        )}

        <ProposalRenderDetail
          label={t(pageTranslations.functionName)}
          content={parameter.signature}
          className="break-all"
        />
        <ProposalRenderDetail
          label={t(pageTranslations.data)}
          content={parameter.calldata}
          className="break-all"
        />
      </div>
    </div>
  );
};
