import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';

type NewStakeRendererProps = {
  hasStakedSov: boolean;
};

export const NewStakeRenderer: FC<NewStakeRendererProps> = ({
  hasStakedSov,
}) => {
  const { account } = useAccount();

  return (
    <>
      {account && (
        <div className="flex md:flex-row items-center gap-4 flex-col-reverse">
          {hasStakedSov && (
            <Button
              style={ButtonStyle.ghost}
              size={ButtonSize.small}
              text={t(translations.stakePage.table.rewardsButton)}
              href="/rewards"
              dataAttribute="stakes-rewards-button"
              className="w-full md:w-auto"
            />
          )}
          <Button
            style={ButtonStyle.primary}
            size={ButtonSize.small}
            text={
              hasStakedSov
                ? t(translations.stakePage.table.addNewStakeButton)
                : t(translations.stakePage.table.stakeButton)
            }
            onClick={() => {}}
            dataAttribute="stakes-stake-button"
            className="w-full md:w-auto"
          />
        </div>
      )}
    </>
  );
};
