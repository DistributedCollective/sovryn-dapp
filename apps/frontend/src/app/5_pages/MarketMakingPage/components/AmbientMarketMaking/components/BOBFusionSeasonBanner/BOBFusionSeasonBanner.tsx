import React, { FC } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle, Icon, IconNames, Paragraph } from '@sovryn/ui';

import { useChainStore } from '../../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../../locales/i18n';
import { isBobChain } from '../../../../../../../utils/chain';

export const BOBFusionSeasonBanner: FC = () => {
  const { currentChainId } = useChainStore();
  const navigate = useNavigate();

  if (!isBobChain(currentChainId)) {
    return null;
  }

  return (
    <div className="mx-auto w-full text-center mb-4">
      <div className="flex flex-col sm:flex-row justify-center items-center bg-gray-60 rounded-lg text-white px-4 py-2">
        <div className="flex flex-row items-center w-full text-left sm:text-center">
          <div className="grow">
            <div className="flex items-center justify-center">
              <div>
                <Icon icon={IconNames.INFO} size={18} />
              </div>
              <div className="ml-2 text-center">
                <Paragraph className="font-medium text-sm">
                  {t(translations.leaderboardPointsPage.claimDescription)}
                </Paragraph>
              </div>
              <div className="ml-2 text-center text-sm">
                <Button
                  text={t(translations.leaderboardPointsPage.claimLp)}
                  onClick={() => navigate('/claim-lp')}
                  style={ButtonStyle.ghost}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
