import React, { useCallback, useState } from 'react';

import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';
import { Accordion, SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../2_molecules/AmountRenderer/AmountRenderer';
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
                value={
                  <AmountRenderer
                    value={limits.minPerToken}
                    decimals={0}
                    suffix={getTokenDisplayName(asset)}
                  />
                }
              />
              <SimpleTableRow
                label={t(translation.maximumAmount)}
                value={
                  <AmountRenderer
                    value={limits.maxTokensAllowed}
                    decimals={0}
                    suffix={getTokenDisplayName(asset)}
                  />
                }
              />
              <SimpleTableRow
                label={t(translation.dailyLimit)}
                value={
                  <AmountRenderer
                    value={limits.dailyLimit}
                    decimals={0}
                    suffix={getTokenDisplayName(asset)}
                  />
                }
              />
              <SimpleTableRow
                label={t(translation.dailyLimitSpent)}
                value={
                  <AmountRenderer
                    value={limits.spentToday}
                    decimals={0}
                    suffix={getTokenDisplayName(asset)}
                  />
                }
              />
              <SimpleTableRow
                label={t(translation.fee)}
                value={
                  <AmountRenderer
                    value={limits.feePerToken}
                    decimals={0}
                    suffix={getTokenDisplayName(asset)}
                  />
                }
              />
            </SimpleTable>
          ) : (
            <span className="h-10 w-full block bg-gray-50 rounded animate-pulse" />
          )
        }
        className={className}
        open={open}
        onClick={onClick}
        labelClassName="font-medium"
      />
    </>
  );
};
