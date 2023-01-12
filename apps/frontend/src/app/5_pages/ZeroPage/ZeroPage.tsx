import { Fees, UserTrove } from '@sovryn-zero/lib-base';

import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';

import { Contract, providers } from 'ethers';
import { Await, useLoaderData } from 'react-router-dom';

import { getContract } from '@sovryn/contracts';
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  noop,
} from '@sovryn/ui';

import { LOCStatus } from '../../2_molecules/LOCStatus/LOCStatus';
import {
  AdjustCreditLine,
  SubmitValue,
} from '../../3_organisms/ZeroLocForm/AdjustCreditLine';
import { CloseCreditLine } from '../../3_organisms/ZeroLocForm/CloseCreditLine';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useWalletConnect } from '../../../hooks';
import { getRskChainId } from '../../../utils/chain';
import { toWei } from '../../../utils/math';
import { ZeroPageLoaderData } from './loader';
import { adjustTrove, openTrove } from './utils/trove-manager';

export const ZeroPage: FC = () => {
  const { liquity, deferedData } = useLoaderData() as ZeroPageLoaderData;

  const { setTransactions, setIsOpen } = useTransactionContext();

  const [open, toggle] = useReducer(v => !v, false);
  const [openClosePopup, toggleClosePopup] = useReducer(v => !v, false);
  const [trove, setTrove] = useState<UserTrove>();
  const [zusdBalance, setZusdBalance] = React.useState('');

  const { account, getWallet, connectWallet } = useWalletConnect();

  useEffect(() => {
    if (account && liquity) {
      liquity.getTrove(account).then(setTrove);
    }
  }, [account, liquity]);

  useEffect(() => {
    const getZUSDBalance = async () => {
      const balance = (await liquity.getZUSDBalance(account)).toString();
      return balance;
    };

    if (account && liquity) {
      getZUSDBalance().then(setZusdBalance);
    }
  }, [account, liquity]);

  const handleTroveSubmit = useCallback(
    async (value: SubmitValue) => {
      const wallet = getWallet(0);

      if (wallet?.provider) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          getRskChainId(),
        );

        const contract = new Contract(
          address,
          abi,
          new providers.Web3Provider(wallet.provider).getSigner(),
        );

        if (trove?.debt?.gt(0)) {
          const adjustedTrove = await adjustTrove(wallet.accounts[0].address, {
            borrowZUSD: toWei(value.debt).toString(),
            depositCollateral: toWei(value.collateral).toString(),
          });
          console.log('adjustedTrove', adjustedTrove);
          setTransactions([
            {
              title: 'Adjusting Trove',
              contract,
              fnName: 'adjustTrove',
              config: {
                value: adjustedTrove.value,
              },
              args: adjustedTrove.args,
              onComplete: hash => console.log('hash', hash),
            },
          ]);
          setIsOpen(true);
        } else {
          const openedTrove = await openTrove({
            borrowZUSD: toWei(value.debt).toString(),
            depositCollateral: toWei(value.collateral).toString(),
          });
          setTransactions([
            {
              title: 'Open Trove',
              contract,
              fnName: 'openTrove',
              config: {
                value: openedTrove.value,
              },
              args: openedTrove.args,
              onComplete: hash => console.log('hash', hash),
            },
          ]);
          setIsOpen(true);
        }
      }
    },
    [getWallet, setIsOpen, setTransactions, trove?.debt],
  );

  return (
    <div className="container max-w-7xl mt-24">
      <React.Suspense fallback={<p>Loading stuff...</p>}>
        <Await resolve={deferedData} errorElement={<p>Error loading stuff!</p>}>
          {([price, fees]: [string, Fees]) => (
            <>
              {account ? (
                <>
                  <LOCStatus
                    collateral={Number(trove?.collateral ?? 0)}
                    debt={Number(trove?.debt ?? 0)}
                    cRatio={
                      ((Number(trove?.collateral ?? 0) * Number(price)) /
                        Number(trove?.debt ?? 0)) *
                      100
                    }
                    debtSymbol={'ZUSD'}
                    onAdjust={toggle}
                    onClose={toggleClosePopup}
                  />
                </>
              ) : (
                <Button text="Connect first...." onClick={connectWallet} />
              )}

              <Dialog
                width={DialogSize.sm}
                isOpen={open}
                disableFocusTrap
                mobileView
              >
                <DialogHeader
                  title={trove?.debt?.lte(0) ? 'Open' : 'Adjust'}
                  onClose={toggle}
                />
                <DialogBody>
                  <AdjustCreditLine
                    collateralValue={trove?.collateral.toString() ?? '0'}
                    creditValue={trove?.debt.toString() ?? '0'}
                    onSubmit={handleTroveSubmit}
                    rbtcPrice={price}
                    fees={fees}
                  />
                </DialogBody>
              </Dialog>

              <Dialog
                width={DialogSize.sm}
                isOpen={openClosePopup}
                disableFocusTrap
              >
                <DialogHeader title="Close" onClose={toggleClosePopup} />
                <DialogBody>
                  <CloseCreditLine
                    onSubmit={noop}
                    creditValue={trove?.debt.toString() ?? '0'}
                    collateralValue={trove?.collateral.toString() ?? '0'}
                    availableBalance={zusdBalance}
                  />
                </DialogBody>
              </Dialog>
            </>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
};
