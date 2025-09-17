import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { BOB_MIGRATION_LINK } from '../../3_organisms/RuneBridgeDialog/constants';
import { useChainStore } from '../../../hooks/useChainStore';
import { translations } from '../../../locales/i18n';
import { isBobChain } from '../../../utils/chain';

export const DeprecatedBadge: FC = () => {
  const { currentChainId } = useChainStore();

  if (!isBobChain(currentChainId)) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-10 font-medium text-[10px] border border-primary-30 rounded-sm px-1 py-0.5">
        {t(translations.ambientMarketMaking.deprecated)}
      </span>
      <Button
        text={t(translations.ambientMarketMaking.migrate)}
        size={ButtonSize.small}
        style={ButtonStyle.ghost}
        href={BOB_MIGRATION_LINK}
        hrefExternal
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};
