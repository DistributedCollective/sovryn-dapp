import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Heading } from '@sovryn/ui';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { TxIdWithNotification } from '../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { ProposalCreationParameter } from '../../5_pages/BitocracyPage/contexts/ProposalContext.types';
import { translations } from '../../../locales/i18n';
import { getRskExplorerUrl } from '../../../utils/helpers';
import { isTreasuryProposalParameter } from './ProposalExecutableDetails.utils';
import { ProposalRenderDetail } from './components/ProposalRenderDetail/ProposalRenderDetail';
import { useGetTreasuryExecutableDetail } from './hooks/useGetTreasuryExecutableDetails';

type ProposalExecutableDetailProps = {
  parameter: ProposalCreationParameter;
  index: number;
};

const rskExplorerUrl = getRskExplorerUrl();

const pageTranslations = translations.proposalPage.executableDetails;

export const ProposalExecutableDetail: FC<ProposalExecutableDetailProps> = ({
  parameter,
  index,
}) => {
  const isTreasuryProposal = useMemo(
    () => isTreasuryProposalParameter(parameter.signature),
    [parameter.signature],
  );

  const { assetName, assetAmount, assetAddress, recipientAddress } =
    useGetTreasuryExecutableDetail(parameter);

  return (
    <div className="w-full font-medium bg-gray-80 p-3 rounded">
      <Heading className="text-xs">
        {t(pageTranslations.executable)} #{index + 1}
      </Heading>

      <div className="w-full text-gray-30">
        {isTreasuryProposal && (
          <>
            <ProposalRenderDetail
              label={t(pageTranslations.assetName)}
              content={assetName?.toUpperCase()}
            />
            <ProposalRenderDetail
              label={t(pageTranslations.assetAmount)}
              content={<AmountRenderer value={assetAmount} />}
            />
            <ProposalRenderDetail
              label={t(pageTranslations.assetAddress)}
              content={
                <TxIdWithNotification
                  href={`${rskExplorerUrl}/address/${assetAddress}`}
                  value={assetAddress}
                  dataAttribute="treasury-proposal-asset-address"
                />
              }
            />
          </>
        )}

        <ProposalRenderDetail
          label={t(pageTranslations.contractAddress)}
          content={
            <TxIdWithNotification
              href={`${rskExplorerUrl}/address/${parameter.target}`}
              value={parameter.target}
              dataAttribute="proposal-contract-address-id"
            />
          }
        />

        {isTreasuryProposal && (
          <ProposalRenderDetail
            label={t(pageTranslations.recipientAddress)}
            content={
              <TxIdWithNotification
                href={`${rskExplorerUrl}/address/${recipientAddress}`}
                value={recipientAddress}
                dataAttribute="treasury-proposal-recipient-address"
              />
            }
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
