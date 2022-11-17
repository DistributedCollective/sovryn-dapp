import React, { useEffect, useReducer, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  getTokenDetails,
  SupportedTokens,
  TokenDetailsData,
} from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';
import { Button, Dialog, StatusType } from '@sovryn/ui';

import { SocialLinks, ConnectWalletButton } from '../../2_molecules';
import { ExampleProviderCall } from '../../2_molecules/ExampleProviderCall';
import { TransactionStep, Header } from '../../3_organisms';
import { useTheme } from '../../../hooks/useTheme';
import { useWalletConnect } from '../../../hooks/useWalletConnect';
import { translations } from '../../../locales/i18n';
import { AppTheme } from '../../../types/tailwind';

function App() {
  const { handleThemeChange } = useTheme();
  const { t } = useTranslation();
  const [isOpen, toggle] = useReducer(p => !p, false);
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

  const [tokenDetails, setTokenDetails] = useState<TokenDetailsData>();

  useEffect(() => {
    const getDetails = async () => {
      const details: TokenDetailsData = await getTokenDetails(
        SupportedTokens.xusd,
        ChainIds.RSK_MAINNET,
      );

      return details;
    };
    getDetails().then(setTokenDetails);
  }, []);

  return (
    <>
      <Header />
      <div className="my-2 px-4">
        <div>
          <ExampleProviderCall />

          <div>
            <div>Token details for XUSD on RSK Mainnet</div>
            <div>address: {tokenDetails?.address}</div>
            <div>symbol: {tokenDetails?.symbol}</div>
            <div>decimalPrecision: {tokenDetails?.decimalPrecision}</div>
            <div>
              logo:{' '}
              <div
                dangerouslySetInnerHTML={{ __html: tokenDetails?.icon || '' }}
              />
            </div>
          </div>

          <hr className="my-12" />

          <Button text="Open Dialog" onClick={toggle} />

          <Dialog isOpen={isOpen} onClose={toggle}>
            <div className="p-4">Hello.</div>
          </Dialog>

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
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque
            tempora itaque voluptatum veritatis perferendis temporibus tenetur
            quod corrupti rerum voluptatibus? Totam a quas recusandae quasi
            molestiae ipsa omnis dolorum aliquam.
          </p>
          <p className="text-primary">
            GTM: {process.env.REACT_APP_GOOGLE_ANALYTICS}
          </p>
        </div>
        <main>
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
          <br />
          <div className="w-32">
            <SocialLinks dataAttribute="socials" />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
