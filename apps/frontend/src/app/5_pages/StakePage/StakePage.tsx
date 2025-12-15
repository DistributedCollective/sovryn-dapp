import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';

import { Icon, IconNames } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { useRequiredChain } from '../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../hooks/useAccount';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { translations } from '../../../locales/i18n';
import { getChainLabel, isRskChain } from '../../../utils/chain';
import { AddStakeRenderer } from './components/AddStakeRenderer/AddStakeRenderer';
import { PersonalStakingStatistics } from './components/PersonalStakingStatistics/PersonalStakingStatistics';
import { useGetPersonalStakingStatistics } from './components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { StakesFrame } from './components/StakesFrame/StakesFrame';
import { StakingRewards } from './components/StakingRewards/StakingRewards';
import { StakingStatistics } from './components/StakingStatistics/StakingStatistics';
import { VestingStakesFrame } from './components/VestingStakesFrame/VestingStakesFrame';

const StakePage: FC = () => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const { balance, votingPower } = useGetPersonalStakingStatistics();
  const hasStakedValue = useMemo(() => Number(balance) > 0, [balance]);
  const hasVotingPower = useMemo(() => votingPower > 0, [votingPower]);

  const isRsk = isRskChain(chainId);

  const { updateChain } = useRequiredChain(RSK_CHAIN_ID);

  return (
    <>
      <Helmet>
        <title>{t(translations.stakePage.meta.title)}</title>
      </Helmet>

      {!isRsk && (
        <div>
          <div
            onClick={updateChain}
            className={'mx-auto w-full text-center cursor-pointer mb-4'}
          >
            <div className="flex flex-col sm:flex-row justify-center items-center bg-gray-60 rounded-lg text-white px-4 py-2">
              <div className="flex flex-row items-center w-full text-left sm:text-center">
                <div className="grow">
                  <div className="flex items-center justify-center">
                    <div>
                      <Icon icon={IconNames.INFO} size={18} />
                    </div>
                    <div className="ml-2 text-center text-sm">
                      <Trans
                        i18nKey={t('stakePage.networkSwitch.content')}
                        values={{ network: getChainLabel(RSK_CHAIN_ID) }}
                        components={[
                          <span className="underline text-primary-75">
                            switching to
                          </span>,
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRsk && (
        <div className="px-0 container md:mx-9 mx-0">
          <div className="flex md:flex-row flex-col items-center mb-6 gap-4">
            <StakingStatistics />
            <StakingRewards />
          </div>

          {account && (hasStakedValue || hasVotingPower) && (
            <PersonalStakingStatistics />
          )}

          <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-6">
            <StakesFrame />
            <VestingStakesFrame />
          </div>

          <div className="md:hidden block w-full">
            {account && <AddStakeRenderer hasStakedValue={hasStakedValue} />}
          </div>
        </div>
      )}
    </>
  );
};
export default StakePage;
