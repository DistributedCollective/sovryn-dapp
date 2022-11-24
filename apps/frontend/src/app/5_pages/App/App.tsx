import React, { useCallback, useReducer } from 'react';

import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';

import { getTokenDetails, SupportedTokens } from '@sovryn/contracts';
import { Button, Dialog } from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules';
import { ExampleProviderCall } from '../../2_molecules/ExampleProviderCall';
import { ExampleTokenDetails } from '../../2_molecules/ExampleTokenDetails';
import { Header } from '../../3_organisms';
import { Footer } from '../../3_organisms/Footer/Footer';
import { TransactionStepDialog } from '../../3_organisms/TransactionStepDialog/TransactionStepDialog';
import { defaultChainId } from '../../../config/chains';
import { useTransactionContext } from '../../../context/transactionContext';
import { useTheme } from '../../../hooks/useTheme';
import { useWalletConnect } from '../../../hooks/useWalletConnect';
import { translations } from '../../../locales/i18n';
import { AppTheme } from '../../../types/tailwind';
import { APPROVAL_FUNCTION } from '../../../utils/constants';

function App() {
  const { handleThemeChange } = useTheme();
  const { t } = useTranslation();
  const [isOpen, toggle] = useReducer(p => !p, false);
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const approve = useCallback(async () => {
    if (!wallets[0].provider) return;

    const { address, abi, symbol } = await getTokenDetails(
      SupportedTokens.xusd,
      defaultChainId,
    );

    const provider = new ethers.providers.Web3Provider(wallets[0].provider);
    const signer = provider.getSigner();
    const xusd = new ethers.Contract(address, abi, signer);

    setTransactions([
      {
        title: `Approve ${symbol} tokens`,
        subtitle: `Allow Sovryn protocol to use ${symbol} tokens for the trade`,
        contract: xusd,
        fnName: APPROVAL_FUNCTION,
        args: [address, parseUnits('2')],
      },
      {
        title: `Transfer 2 ${symbol} tokens`,
        contract: xusd,
        fnName: 'transfer',
        args: [wallets[0]?.accounts[0]?.address, parseUnits('2')],
      },
    ]);
    setTitle('Transaction approval');
    setIsOpen(true);
  }, [setIsOpen, setTitle, setTransactions, wallets]);
  return (
    <>
      <Header />
      <TransactionStepDialog />

      <div className="my-2 px-4">
        <div>
          <ExampleProviderCall />
          <ExampleTokenDetails />

          <hr className="my-12" />

          {wallets[0]?.accounts[0]?.address ? (
            <Button text="Approve" onClick={approve} />
          ) : (
            <Button text="Connect to RSK Testnet" onClick={connectWallet} />
          )}

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
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
