import React, { useCallback, useReducer, useState } from 'react';

import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import { Button, Dialog, Dropdown, Menu, MenuItem } from '@sovryn/ui';

import { SocialLinks, ConnectWalletButton } from '../../2_molecules';
import { ExampleProviderCall } from '../../2_molecules/ExampleProviderCall';
import { Header } from '../../3_organisms';
import { TransactionStepDialog } from '../../3_organisms/TransactionStepDialog/TransactionStepDialog';
import { Transaction } from '../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTheme } from '../../../hooks/useTheme';
import { useWalletConnect } from '../../../hooks/useWalletConnect';
import { translations, languages } from '../../../locales/i18n';
import { AppTheme } from '../../../types/tailwind';
import { getTokenContract } from '../../../utils/contracts';

function App() {
  const { handleThemeChange } = useTheme();
  const { t } = useTranslation();
  const [isOpen, toggle] = useReducer(p => !p, false);
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

  const [currentLang, setCurrentLang] = useState(i18next.language);

  const changeLanguage = useCallback(
    (lng: string) => () => {
      i18next.changeLanguage(lng);
      setCurrentLang(lng);
    },
    [],
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);

  const approve = async () => {
    if (!wallets[0].provider) return;
    const { address, abi } = await getTokenContract(
      'xusd',
      ChainIds.RSK_TESTNET,
    );
    const provider = new ethers.providers.Web3Provider(wallets[0].provider);
    const signer = provider.getSigner();
    const xusd = new ethers.Contract(address, abi, signer);

    setTransactions([
      {
        title: 'Approve XUSD tokens',
        subtitle: 'Allow Sovryn protocol to use XUSD tokens for the trade',
        contract: xusd,
        fnName: 'approve',
        args: ['0x716A9720B0D57549Bc9Dbf3257E3D54584d4b0b4', parseUnits('10')],
      },
      {
        title: 'Transfer XUSD tokens',
        contract: xusd,
        fnName: 'transfer',
        args: ['0x716A9720B0D57549Bc9Dbf3257E3D54584d4b0b4', parseUnits('10')],
      },
    ]);
    setOpen(true);
  };
  return (
    <>
      <Header />
      <TransactionStepDialog
        transactions={transactions}
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Transaction approval"
      />
      {wallets[0]?.accounts[0]?.address ? (
        <Button text="approve" onClick={approve} />
      ) : (
        <Button text="connect to testnet" onClick={connectWallet} />
      )}
      <div className="my-2 px-4">
        <div>
          <ExampleProviderCall />

          <hr className="my-12" />

          <Button text="Open Dialog" onClick={toggle} />

          <Dialog isOpen={isOpen} onClose={toggle}>
            <div className="p-4">Hello.</div>
          </Dialog>

          <Dropdown text={currentLang.toUpperCase()} className="my-4">
            <Menu>
              {languages.map(lng => (
                <MenuItem
                  text={lng.toUpperCase()}
                  onClick={changeLanguage(lng)}
                  key={lng}
                />
              ))}
            </Menu>
          </Dropdown>

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
