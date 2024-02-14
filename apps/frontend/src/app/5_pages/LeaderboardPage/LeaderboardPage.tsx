import React, { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { CTA } from '../../2_molecules/CTA/CTA';
import socialBg from '../../../assets/images/Leaderboard/social.svg';
import stakeBg from '../../../assets/images/Leaderboard/stake.svg';
import tradeBg from '../../../assets/images/Leaderboard/trade.svg';

const LeaderboardPage: FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: 'Stake',
      description:
        'Existing stakes Earn 1 point for each VP they hold. New Stake and re-stakes earn 10 points for each VP they hold!',
      action: 'Stake SOV',
      url: () => navigate('/earn/staking'),
      backgroundImage: stakeBg,
    },
    {
      title: 'Trade',
      description:
        'Get 25 points per $1 value you bring in, 10 points per $1 deposit into the SOV or DLLR AMMs, and 1 point per $1 trade.',
      action: 'Deposit stablecoins',
      url: () => (window.location.href = 'https://app.babelfish.money/convert'),
      backgroundImage: tradeBg,
    },
    {
      title: 'Get social!',
      description:
        'Earn points for Twitter engagement! Like, Share and Tweet for some sweet POWA at the airdrop.',
      action: 'Twitter quests',
      url: () => navigate('/earn/staking'),
      backgroundImage: socialBg,
    },
  ];

  return (
    <div className="w-full flex items-center flex-col px-20">
      <div className="w-[26rem] text-center">
        <div className="text-2xl font-medium mt-9">You’ve got the POWA!</div>
        <div className="text-sm font-semibold mt-4">
          A Taproot Assets token - a new Bitcoin token class.
        </div>
        <div className="text-sm font-medium mt-6">
          Earn Points by staking, trading, or promoting Sovryn on Twitter. POWA
          will be airdropped to everyone across the leaderboard according to
          their earned points. Trade your POWA on Sovryn, Use your POWA to buy
          upcoming NFT collections. Connect your wallet to see how many points
          you already have!
        </div>

        <div className="mt-4">
          <Button
            text={'How to earn points'}
            style={ButtonStyle.secondary}
            className="mr-4"
          />
          <Button text={'More about POWA'} style={ButtonStyle.ghost} />
        </div>

        <div className="mt-11">
          <div className="text-2xl font-medium mt-9">
            1 Billion POWA Prize Pool!
          </div>
          <div className="text-sm font-semibold mt-4">
            The more points you’ll have - the more POWA you’ll get!
          </div>
        </div>
      </div>

      <div className="w-3/4 mt-8 bg-gray-80 rounded min-h-64 grid md:grid-cols-2 xl:grid-cols-3 md:gap-6 gap-4">
        {options.map((option, index) => (
          <CTA
            index={index}
            backgroundImage={option.backgroundImage}
            title={option.title}
            description={option.description}
            action={option.action}
            navigateTo={option.url}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
