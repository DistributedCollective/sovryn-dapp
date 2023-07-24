import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Tooltip } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import { borrowCollaterals } from '../../LendPage.constatns';
import styles from './CurrentStats.module.css';

export type CurrentStatsProps = {
  apy: Decimal;
  token: SupportedTokens;
};

export const CurrentStats: FC<CurrentStatsProps> = ({ apy, token }) => {
  const acceptedList = useMemo(() => {
    const acceptedList = borrowCollaterals[token] || [];

    let text = acceptedList
      .slice(0, 3)
      .map(t => getTokenDisplayName(t))
      .join(', ');

    if (acceptedList.length > 3) {
      text += ` ${t(translations.common.and)} ${t(translations.common.more)}`;
    }
    return text;
  }, [token]);

  return (
    <div className="flex flex-col bg-gray-90 px-4 pt-2 pb-4 rounded">
      <AssetRenderer
        logoClassName={styles.assetLogo}
        showAssetLogo
        asset={token}
      />
      <div className="flex gap-8">
        <div className="mt-6 flex flex-col gap-1 text-sm">
          <div className="text-gray-30">{t(translations.lending.apy)}</div>
          <AmountRenderer value={apy} suffix="%" />
        </div>
        <div className="mt-6 flex flex-col gap-2 text-sm">
          <div className="text-gray-30">
            {t(translations.lending.acceptedCollateral)}
          </div>
          <Tooltip content={acceptedList} className={styles.assets}>
            <span>{acceptedList}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
