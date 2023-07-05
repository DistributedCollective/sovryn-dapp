import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';

export const NewStakeRenderer: FC = () => {
  const { account } = useAccount();
  return (
    <>
      {account && (
        <Button
          style={ButtonStyle.primary}
          size={ButtonSize.small}
          text={t(translations.stakePage.table.stakeButton)}
          onClick={() => {}}
          dataAttribute="stakes-stake-button"
          className="w-full md:w-auto"
        />
      )}
    </>
  );
};
