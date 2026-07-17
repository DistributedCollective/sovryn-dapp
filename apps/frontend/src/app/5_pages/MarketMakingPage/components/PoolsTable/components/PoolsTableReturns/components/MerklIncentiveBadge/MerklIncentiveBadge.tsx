import React, { FC } from 'react';

import { t } from 'i18next';

import { Tooltip, TooltipPlacement, TooltipTrigger } from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { MERKL_USDT0_CAMPAIGN_URL } from './MerklIncentiveBadge.constants';

export const MerklIncentiveBadge: FC = () => (
  <span
    className="prevent-row-click inline-flex"
    onClick={event => event.stopPropagation()}
  >
    <Tooltip
      content={
        <div className="max-w-xs">
          <div className="font-semibold mb-1">
            {t(translations.marketMakingPage.poolsTable.merklIncentive.title)}
          </div>
          <div className="mb-2">
            {t(
              translations.marketMakingPage.poolsTable.merklIncentive
                .description,
            )}
          </div>
          <a
            href={MERKL_USDT0_CAMPAIGN_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline"
          >
            {t(translations.marketMakingPage.poolsTable.merklIncentive.cta)} ↗
          </a>
        </div>
      }
      trigger={TooltipTrigger.hover}
      placement={TooltipPlacement.top}
      dataAttribute="merkl-incentive-badge"
    >
      <span className="inline-flex cursor-pointer">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Merkl incentives"
        >
          <circle cx="8" cy="8" r="7.25" stroke="#F57118" strokeWidth="1.5" />
          <g
            stroke="#F57118"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.8 7.4h6.4v3.9a.7.7 0 0 1-.7.7H5.5a.7.7 0 0 1-.7-.7V7.4Z" />
            <path d="M4.3 5.8h7.4v1.6H4.3z" />
            <path d="M8 5.8V12" />
            <path d="M8 5.6c-.5-1.2-1.5-1.9-2.3-1.4-.7.4-.4 1.4.4 1.6L8 5.6Zm0 0c.5-1.2 1.5-1.9 2.3-1.4.7.4.4 1.4-.4 1.6L8 5.6Z" />
          </g>
        </svg>
      </span>
    </Tooltip>
  </span>
);
