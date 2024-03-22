import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Button, ButtonSize, ButtonStyle, Paragraph } from '@sovryn/ui';

import { ConnectWalletButton } from '../../../../2_molecules';
import { useWalletConnect } from '../../../../../hooks';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../locales/i18n';
import { sharedState } from '../../../../../store/rxjs/shared-state';
import { GETTING_STARTED_URL } from './GetStarted.constants';
import { GetStartedSteps } from './components/GetStartedSteps/GetStartedSteps';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';

const pageTranslations = translations.landingPage.getStarted;

export const GetStarted: FC = () => {
  const { connectWallet, disconnectWallet, account, pending } =
    useWalletConnect();
  const { balance } = useAssetBalance(COMMON_SYMBOLS.BTC);

  const hasRbtcBalance = useMemo(() => Number(balance) !== 0, [balance]);

  const handleFastBtcClick = useCallback(
    () => sharedState.actions.openFastBtcDialog(!hasRbtcBalance),
    [hasRbtcBalance],
  );

  return (
    <div className="max-w-full xl:max-w-md">
      <Paragraph
        className="font-medium text-2xl text-sov-white"
        children={t(pageTranslations.title)}
      />
      <GetStartedSteps />
      <div className="flex m-6">
        {account ? (
          <Button
            text={t(pageTranslations.actions.fundYourWallet)}
            onClick={handleFastBtcClick}
            size={ButtonSize.large}
            dataAttribute="get-started-section-fund"
          />
        ) : (
          <ConnectWalletButton
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            address={account}
            pending={pending}
            dataAttribute="get-started-section-connect"
            className="h-10 py-3 px-6"
          />
        )}
        <Button
          text={t(pageTranslations.actions.learnMore)}
          className="ml-6"
          style={ButtonStyle.ghost}
          href={GETTING_STARTED_URL}
          hrefExternal
          dataAttribute="get-started-section-learn-more"
        />
      </div>
    </div>
  );
};
