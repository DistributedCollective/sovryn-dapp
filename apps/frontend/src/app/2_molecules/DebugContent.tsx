import React, { useReducer } from 'react';

import { useTranslation } from 'react-i18next';

import { Accordion, StatusType } from '@sovryn/ui';

import { TransactionStep } from '../3_organisms';
import { useTheme, useWalletConnect } from '../../hooks';
import { translations } from '../../locales/i18n';
import { AppTheme } from '../../types/tailwind';
import { CollateralRatio } from './CollateralRatio/CollateralRatio';
import { ConnectWalletButton } from './ConnectWalletButton/ConnectWalletButton';
import { ExampleProviderCall } from './ExampleProviderCall';

// usage example, to be removed
export const DebugContent = () => {
  const { handleThemeChange } = useTheme();
  const { t } = useTranslation();
  const [isOpen, toggle] = useReducer(p => !p, false);
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

  return (
    <Accordion label="Debug content" open={isOpen} onClick={toggle}>
      <ExampleProviderCall />

      <hr className="my-12" />

      <div className="flex items-center gap-4">
        <div
          className="cursor-pointer"
          onClick={() => handleThemeChange(AppTheme.sovryn)}
        >
          Sovryn
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleThemeChange(AppTheme.dark)}
        >
          Dark
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleThemeChange(AppTheme.light)}
        >
          Light
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleThemeChange(AppTheme.coffee)}
        >
          coffee
        </div>
      </div>
      <p className="text-primary">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque tempora
        itaque voluptatum veritatis perferendis temporibus tenetur quod corrupti
        rerum voluptatibus? Totam a quas recusandae quasi molestiae ipsa omnis
        dolorum aliquam.
      </p>
      <p className="text-primary">
        GTM: {process.env.REACT_APP_GOOGLE_ANALYTICS}
      </p>
      <CollateralRatio value={200} />
      <br />
      <br />
      <TransactionStep
        step="1"
        title="Approve FISH tokens"
        subtitle="Allow Sovryn protocol to use FISH tokens for the trade"
        txDetails={{
          amount: '0.17519949',
          token: 'FISH',
          gasFee: '0.00006191',
        }}
        status={StatusType.idle}
        txID="0xEDb8897aB6E907bc63CB256f74437D36298507E2"
      />
      <br />
      <br />
      <br />
      <div>
        <ConnectWalletButton
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          address={wallets[0]?.accounts[0]?.address}
          pending={pending}
        />
      </div>

      <br />
      <br />
      <p>{t(translations.wallet)}</p>
    </Accordion>
  );
};
