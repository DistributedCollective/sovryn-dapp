import React, { useCallback, useState } from 'react';

import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

import { getTokenDetails, SupportedTokens } from '@sovryn/contracts';
import { getZeroContract } from '@sovryn/contracts';
import { AmountInput, Button, NotificationType } from '@sovryn/ui';

import { defaultChainId } from '../../config/chains';

import { TransactionStepDialog } from '../3_organisms';
import { CollateralSurplusHistoryFrame } from '../3_organisms/CollateralSurplusWithdrawals/CollateralSurplusWithdrawals';
import { EmailNotificationSettingsDialog } from '../3_organisms/EmailNotificationSettingsDialog/EmailNotificationSettingsDialog';
import { GettingStartedPopup } from '../3_organisms/GettingStartedPopup/GettingStartedPopup';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { useTheme, useWalletConnect } from '../../hooks';
import { useBlockNumber } from '../../hooks/useBlockNumber';
import { useMaintenance } from '../../hooks/useMaintenance';
import { translations } from '../../locales/i18n';
import { AppTheme } from '../../types/tailwind';
import { APPROVAL_FUNCTION, EXPORT_RECORD_LIMIT } from '../../utils/constants';
import {
  useGetTokenRatesQuery,
  useGetTransactionsLazyQuery,
} from '../../utils/graphql/rsk/generated';
import { isMainnet } from '../../utils/helpers';
import { CollateralRatio } from './CollateralRatio/CollateralRatio';
import { ConnectWalletButton } from './ConnectWalletButton/ConnectWalletButton';
import { ExampleBalanceCall } from './ExampleBalanceCall';
import { ExampleContractCall } from './ExampleContractCall';
import { ExampleProviderCall } from './ExampleProviderCall';
import { ExampleTokenDetails } from './ExampleTokenDetails';
import { ExampleTypedDataSign } from './ExampleTypedDataSign';
import { ExportCSV } from './ExportCSV/ExportCSV';
import { LOCStatus } from './LOCStatus/LOCStatus';
import { SmartTokens } from './SmartTokens';

// usage example, to be removed
export const DebugContent = () => {
  const { handleThemeChange } = useTheme();
  const { addNotification } = useNotificationContext();
  const { t } = useTranslation();
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [
    isEmailNotificationSettingsDialogOpen,
    setIsEmailNotificationSettingsDialogOpen,
  ] = useState(false);

  const [cRatio, setCRatio] = useState(200);
  const { data } = useGetTokenRatesQuery();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const [getTransactions] = useGetTransactionsLazyQuery();

  const { checkMaintenance, States } = useMaintenance();
  const dappLockedTest = checkMaintenance(States.FULLD2);

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

  const NUM_LOCS_TO_LIQ = 10;
  const liquidateLowestLocs = useCallback(async () => {
    if (!wallets[0].provider) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(wallets[0].provider);
    const signer = provider.getSigner();

    const { address: troveManagerAddress, abi: troveManagerAbi } =
      await getZeroContract('troveManager', defaultChainId);

    const troveManager = new ethers.Contract(
      troveManagerAddress,
      troveManagerAbi,
      signer,
    );

    setTransactions([
      {
        title: `Liquidating lowest ${NUM_LOCS_TO_LIQ} lines of credit`,
        subtitle: `Attempting to liquidate lowest ${NUM_LOCS_TO_LIQ} LoCs`,
        contract: troveManager,
        fnName: 'liquidateTroves',
        args: [NUM_LOCS_TO_LIQ],
      },
    ]);
    setTitle('Liquidating');
    setIsOpen(true);
  }, [setIsOpen, setTitle, setTransactions, wallets]);

  const exportData = useCallback(async () => {
    const { data } = await getTransactions({
      variables: { limit: EXPORT_RECORD_LIMIT },
    });
    let transactions = data?.transactions || [];

    return transactions.map(tx => ({
      from: tx.from.id,
      to: tx.to,
      gasPrice: tx.gasPrice,
      gasLimit: tx.gasLimit,
    }));
  }, [getTransactions]);

  const { value: block } = useBlockNumber();

  return (
    <>
      <div>Block: {block}</div>
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() =>
            addNotification(
              {
                type: NotificationType.success,
                title:
                  'Transaction approved ' + Math.floor(Math.random() * 1000),
                content: '',
                dismissible: true,
                id: nanoid(),
              },
              0,
            )
          }
          text="Add Notification"
        />

        <Button
          onClick={() =>
            addNotification({
              type: NotificationType.error,
              title: 'Transaction error ' + Math.floor(Math.random() * 1000),
              content: '',
              dismissible: true,
              id: nanoid(),
            })
          }
          text="Add Notification With Timer"
        />
      </div>
      <div className="mt-5 py-10 border-b">
        <AmountInput
          className="mb-2"
          label="Collateral ratio"
          value={cRatio}
          onChange={e => setCRatio(Number(e.target.value))}
        />
        <LOCStatus
          collateral={0.51}
          debt={5000}
          debtSymbol={SupportedTokens.zusd.toUpperCase()}
          cRatio={cRatio}
        />
        <LOCStatus className="mt-4" withdrawalSurplus={0.5} />
      </div>
      <div className="my-4">
        {wallets[0]?.accounts[0]?.address ? (
          <div>
            <Button text="Approve" onClick={approve} />
            <ExampleTypedDataSign />
            <Button
              text={`Liquidate lowest ${NUM_LOCS_TO_LIQ} LoCs`}
              className="mx-4"
              onClick={liquidateLowestLocs}
            />
          </div>
        ) : (
          <Button text="Connect to RSK Testnet" onClick={connectWallet} />
        )}
      </div>
      <TransactionStepDialog />
      <ExampleProviderCall />
      <ExampleTokenDetails />
      <ExampleBalanceCall />
      <ExampleContractCall />
      <SmartTokens />
      <ExampleContractCall />
      <ExportCSV getData={exportData} filename="transactions" />
      <div>
        USD price of SOV from the graph:{' '}
        {data?.tokens.find(token => token.symbol === 'SOV')?.lastPriceUsd}
      </div>
      <div className="my-12">
        <Button
          text="Click to open email notification settings dialog"
          onClick={() => setIsEmailNotificationSettingsDialogOpen(true)}
        />
        <EmailNotificationSettingsDialog
          isOpen={isEmailNotificationSettingsDialogOpen}
          onClose={() => setIsEmailNotificationSettingsDialogOpen(false)}
        />
      </div>
      <hr className="my-12" />
      <div className="mb-12">
        Dapp2 maintenance mode for {isMainnet() ? 'MAINNET' : 'TESTNET'} is{' '}
        {dappLockedTest ? 'ON' : 'OFF'}
      </div>
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
      <div className="mt-10 py-10 border-t border-b">
        <h2>Getting started popup</h2>
        <br />
        <Button
          text="Open Getting Started Popup"
          onClick={() => setIsPopupOpen(true)}
        />

        {isPopupOpen && (
          <GettingStartedPopup
            isOpen={isPopupOpen}
            onConfirm={() => setIsPopupOpen(false)}
          />
        )}
      </div>
    </>
  );
};
