import React, { useReducer } from 'react';

import { Button, Dialog, Dropdown, noop, StatusType } from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules/ConnectWalletButton/ConnectWalletButton';
import { TransactionStep } from '../../3_organisms/TransactionStep/TransactionStep';
import { useTheme } from '../../../hooks/useTheme';
import { useWalletConnect } from '../../../hooks/useWalletConnect';
import { AppTheme } from '../../../types/tailwind';
import styles from './App.module.css';

function App() {
  const { handleThemeChange } = useTheme();

  const [isOpen, toggle] = useReducer(p => !p, false);
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

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

        <Dropdown text="test">
          <div>
            <div className="my-2" onClick={noop}>
              Dropdown Item 1
            </div>
            <div className="my-2" onClick={noop}>
              Dropdown Item 2
            </div>
            <div className="my-2" onClick={noop}>
              Dropdown Item 3
            </div>
          </div>
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
      </main>
    </div>
  );
}

export default App;
