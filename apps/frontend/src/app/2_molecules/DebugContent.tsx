import React, { useCallback, useReducer } from 'react';

import { useTranslation } from 'react-i18next';

import { Accordion, Button } from '@sovryn/ui';

import { TransactionStepDialog } from '../3_organisms';
import { useTheme, useWalletConnect } from '../../hooks';
import { translations } from '../../locales/i18n';
import { AppTheme } from '../../types/tailwind';
import { ConnectWalletButton } from './ConnectWalletButton/ConnectWalletButton';
import { ExampleProviderCall } from './ExampleProviderCall';
import { APPROVAL_FUNCTION } from '../../utils/constants';
import { defaultChainId } from '../../config/chains';
import { useTransactionContext } from '../../context/transactionContext';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { getTokenDetails, SupportedTokens } from '@sovryn/contracts';
import { ExampleTokenDetails } from './ExampleTokenDetails';
import { ExampleTypedDataSign } from './ExampleTypedDataSign';

// usage example, to be removed
export const DebugContent = () => {
  const { handleThemeChange } = useTheme();
  const { t } = useTranslation();
  const [isOpen, toggle] = useReducer(p => !p, false);
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const approve = useCallback(async () => {
    if (!wallets[0].provider) {
      return;
    }
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
    <Accordion label="Debug content" open={isOpen} onClick={toggle}>
      <TransactionStepDialog />
      <ExampleProviderCall />
      <ExampleTokenDetails />

      <hr className="my-12" />

      {wallets[0]?.accounts[0]?.address ? (
        <div>
          <Button text="Approve" onClick={approve} />
          <ExampleTypedDataSign />
        </div>
      ) : (
        <Button text="Connect to RSK Testnet" onClick={connectWallet} />
      )}
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
