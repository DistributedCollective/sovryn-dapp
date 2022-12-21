import { Fees, UserTrove } from '@sovryn-zero/lib-base';
import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';

import React, { FC, useEffect, useReducer, useState } from 'react';

import { useRouteLoaderData } from 'react-router-dom';

import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  Heading,
  noop,
} from '@sovryn/ui';

import { AdjustCreditLine } from '../../3_organisms/ZeroLocForm/AdjustCreditLine';
import { CloseCreditLine } from '../../3_organisms/ZeroLocForm/CloseCreditLine';
import { useWalletConnect } from '../../../hooks';

export const ZeroPage: FC = () => {
  const { liquity } = useRouteLoaderData('zero') as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquity;
  };

  const [open, toggle] = useReducer(v => !v, false);
  const [openClosePopup, toggleClosePopup] = useReducer(v => !v, false);
  const [trove, setTrove] = useState<UserTrove>();
  const [btcPrice, setBtcPrice] = useState('0');
  const [fees, setFees] = useState<Fees>();
  const [zusdBalance, setZusdBalance] = React.useState('');

  const { account } = useWalletConnect();

  useEffect(() => {
    liquity
      .getPrice()
      .then(e => e.toString())
      .then(setBtcPrice);

    liquity.getFees().then(setFees);
  }, [liquity]);

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

  return (
    <div className="container max-w-7xl mt-24">
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

          <Button text="Adjust" onClick={toggle} className="mt-8" />
          <Button
            text="Close Line of Credit"
            onClick={toggleClosePopup}
            className="mt-8 ml-4"
          />
        </>
      ) : (
        <>Connect first.</>
      )}

      <Dialog width={DialogSize.sm} isOpen={open} disableFocusTrap>
        <DialogHeader title="Adjust" onClose={toggle} />
        <DialogBody>
          <AdjustCreditLine
            collateralValue={trove?.collateral.toString() ?? '0'}
            creditValue={trove?.debt.toString() ?? '0'}
            onSubmit={noop}
            rbtcPrice={btcPrice}
            fees={fees}
          />
        </DialogBody>
      </Dialog>

      <Dialog width={DialogSize.sm} isOpen={openClosePopup} disableFocusTrap>
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
    </div>
  );
};
