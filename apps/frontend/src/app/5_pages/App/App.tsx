import React, { useReducer, useState } from 'react';

import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { Button, Dialog, Dropdown, Menu, MenuItem } from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules/ConnectWalletButton/ConnectWalletButton';
import { useTheme } from '../../../hooks/useTheme';
import { useWalletConnect } from '../../../hooks/useWalletConnect';
import { translations, languages } from '../../../locales/i18n';
import { AppTheme } from '../../../types/tailwind';
import styles from './App.module.css';

function App() {
  const { handleThemeChange } = useTheme();
  const { t } = useTranslation();
  const [isOpen, toggle] = useReducer(p => !p, false);
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

  const [currentLang, setCurrentLang] = useState(i18next.language);

  const changeLanguage = lng => {
    i18next.changeLanguage(lng);
    setCurrentLang(lng);
  };

  return (
    <div className="my-2 px-4">
      <header>
        <p className={styles.test}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>

        <Button text="Open Dialog" onClick={toggle} />

        <Dialog isOpen={isOpen} onClose={toggle}>
          <div className="p-4">Hello.</div>
        </Dialog>

        <Dropdown text={currentLang.toUpperCase()} className="my-4">
          <Menu>
            {languages.map(lng => (
              <MenuItem
                text={lng.toUpperCase()}
                onClick={() => changeLanguage(lng)}
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
      </header>
      <main>
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
  );
}

export default App;
