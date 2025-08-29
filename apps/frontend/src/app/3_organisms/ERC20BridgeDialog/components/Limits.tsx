import React, { useCallback, useState } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';
import { Accordion, SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { getTokenDisplayName } from '../../../../constants/tokens';
import { translations } from '../../../../locales/i18n';
import { useBridgeLimits } from '../hooks/useBridgeLimits';

const translation = translations.erc20Bridge.limits;

type LimitsProps = {
  sourceChain?: ChainId;
  targetChain?: ChainId;
  asset?: string;
  className?: string;
};

export const Limits: React.FC<LimitsProps> = ({
  sourceChain,
  targetChain,
  asset,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const { data: limits } = useBridgeLimits(sourceChain, targetChain, asset);
  const onClick = useCallback((toOpen: boolean) => setOpen(toOpen), []);

  if (!asset) {
    return null;
  }
  return (
    <>
      <Accordion
        label={t(translation.title)}
        disabled={!asset || !sourceChain || !targetChain}
        children={
          limits ? (
            <SimpleTable border>
              <SimpleTableRow
                label={t(translation.minimumAmount)}
                value={`${formatUnits(
                  limits.minPerToken,
                )} ${getTokenDisplayName(asset)}`}
              />
              <SimpleTableRow
                label={t(translation.maximumAmount)}
                value={`${formatUnits(
                  limits.maxTokensAllowed,
                )} ${getTokenDisplayName(asset)}`}
              />
              <SimpleTableRow
                label={t(translation.dailyLimit)}
                value={`${formatUnits(limits.dailyLimit)} ${getTokenDisplayName(
                  asset,
                )}`}
              />
              <SimpleTableRow
                label={t(translation.dailyLimitSpent)}
                value={`${formatUnits(limits.spentToday)} ${getTokenDisplayName(
                  asset,
                )}`}
              />
              <SimpleTableRow
                label={t(translation.fee)}
                value={`${formatUnits(
                  limits.feePerToken,
                )} ${getTokenDisplayName(asset)}`}
              />
            </SimpleTable>
          ) : (
            <span className="h-10 w-full block bg-gray-50 rounded animate-pulse" />
          )
        }
        className={className}
        open={open}
        onClick={onClick}
      />
    </>
  );
};
