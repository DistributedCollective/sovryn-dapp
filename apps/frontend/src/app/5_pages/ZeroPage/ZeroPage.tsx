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
  Heading,
} from '@sovryn/ui';

import {
  AdjustCreditLine,
  SubmitValue,
} from '../../3_organisms/ZeroLocForm/AdjustCreditLine';
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
  const [trove, setTrove] = useState<UserTrove>();

  const { account, getWallet, connectWallet } = useWalletConnect();

  useEffect(() => {
    if (account && liquity) {
      liquity.getTrove(account).then(setTrove);
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
            borrowZUSD: toWei(value.debt).toHexString(),
            depositCollateral: toWei(value.collateral).toHexString(),
          });
          setTransactions([
            {
              title: 'Adjusting Trove',
              contract,
              fnName: 'adjustTrove',
              config: {
                value: adjustedTrove.value.hex,
              },
              args: adjustedTrove.args,
              onComplete: hash => console.log('hash', hash),
            },
          ]);
          setIsOpen(true);
        } else {
          const openedTrove = await openTrove({
            borrowZUSD: toWei(value.debt).toHexString(),
            depositCollateral: toWei(value.collateral).toHexString(),
          });
          setTransactions([
            {
              title: 'Open Trove',
              contract,
              fnName: 'openTrove',
              config: {
                value: openedTrove.value.hex,
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
                  <Heading>Example</Heading>
                  <div className="flex flex-row justify-start items-center text-black gap-8 mt-8">
                    <div className="bg-gray-30 p-3">
                      <div>Debt</div>
                      <div>{trove?.debt.toString() ?? '0'}</div>
                    </div>
                    <div className="bg-gray-30 p-3">
                      <div>Collateral</div>
                      <div>{trove?.collateral.toString() ?? '0'}</div>
                    </div>
                  </div>

                  <Button
                    text={trove?.debt?.lte(0) ? 'Open' : 'Adjust'}
                    onClick={toggle}
                    className="mt-8"
                  />
                </>
              ) : (
                <Button text="Connect first...." onClick={connectWallet} />
              )}

              <Dialog width={DialogSize.sm} isOpen={open} disableFocusTrap>
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
            </>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
};
