import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, Icon, IconNames, Paragraph } from '@sovryn/ui';

import { useChainStore } from '../../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../../locales/i18n';
import { isBobChain } from '../../../../../../../utils/chain';

export const BOBMigrationBanner: FC = () => {
  const { currentChainId } = useChainStore();

  if (!isBobChain(currentChainId)) {
    return null;
  }

  return (
    <div className="w-full text-center bg-gray-80 py-5 flex items-center justify-center gap-3 my-10 rounded-[4px]">
      <Icon className="text-warning" icon={IconNames.INFO} size={18} />
      <Paragraph className="font-medium">
        {t(translations.ambientMarketMaking.migrationBanner)}
      </Paragraph>
      <Button
        text={t(translations.common.learnMore)}
        style={ButtonStyle.ghost}
        href="https://app.gobob.xyz/en/migrate"
        hrefExternal
      />
    </div>
  );
};
