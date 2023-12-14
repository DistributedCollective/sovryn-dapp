import React from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { HelperButton, Link } from '@sovryn/ui';

import { WIKI_LINKS } from '../../../../../constants/links';
import { translations } from '../../../../../locales/i18n';

export const columns = [
  {
    id: 'type',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.rewardPage.liquidityMining.rewardType)}{' '}
        <HelperButton
          content={
            <Trans
              i18nKey={t(
                translations.rewardPage.liquidityMining.rewardTypeInfo,
              )}
              components={[
                <Link
                  text={t(
                    translations.rewardPage.liquidityMining.rewardTypeInfoCTA,
                  )}
                  href={WIKI_LINKS.REWARDS}
                  className="no-underline"
                />,
              ]}
            />
          }
        />
      </span>
    ),
    cellRenderer: row => row.type,
  },
  {
    id: 'amount',
    title: t(translations.common.amount),
    cellRenderer: row => row.amount,
  },
  {
    id: 'pool',
    title: t(translations.rewardPage.liquidityMining.pool),
    cellRenderer: row => row.pool,
  },
  {
    id: 'action',
    title: <></>,
    cellRenderer: row => row.action,
  },
];
