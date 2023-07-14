import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import {
  SupportedTokens,
  TokenDetailsData,
  getLoanTokenContract,
  getTokenDetails,
} from '@sovryn/contracts';
import { Dialog, DialogBody, DialogHeader, Tabs } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../config/chains';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { eventDriven } from '../../../../../store/rxjs/event-driven';
import { Nullable } from '../../../../../types/global';
import { LendModalAction } from '../../LendPage.types';
import { getLoanTokenName } from '../../token-map';
import { Deposit } from './Deposit';
import { Withdraw } from './Withdraw';

export type AdjustModalProps = {
  onDeposit: (amount: Decimal, token: TokenDetailsData, pool: Contract) => void;
  onWithdraw: (
    amount: Decimal,
    token: TokenDetailsData,
    pool: Contract,
  ) => void;
};

export type AdjustModalState = {
  // deposit token
  token: SupportedTokens;
  // lending pool APY
  apy: Decimal;
  // current user balance in the pool
  balance: Decimal;
};

export type FullAdjustModalState = AdjustModalState & {
  poolTokenContract: Contract;
  tokenContract: Contract;
  tokenDetails: TokenDetailsData;
};

export enum Tab {
  Deposit,
  Withdraw,
}

export const AdjustLendingModalContainer: FC<AdjustModalProps> = ({
  onDeposit,
  onWithdraw,
}) => {
  const { subscribe, push } = useMemo(
    () => eventDriven<Nullable<AdjustModalState>>(LendModalAction.Adjust),
    [],
  );

  const { signer, account } = useAccount();

  const [tab, setTab] = useState<Tab>(Tab.Deposit);
  const [state, setState] = useState<Nullable<FullAdjustModalState>>(null);

  useEffect(() => {
    const sub = subscribe(async value => {
      setTab(Tab.Deposit);

      if (value == null || signer == null || account == null) {
        setState(null);
        return;
      }

      const iToken = getLoanTokenName(value.token);
      if (iToken == null) {
        setState(null);
        return;
      }

      const poolToken = await getLoanTokenContract(iToken, defaultChainId);
      const tokenDetails = await getTokenDetails(value.token, defaultChainId);

      const poolTokenContract = new Contract(
        poolToken.address,
        poolToken.abi,
        signer,
      );

      const tokenContract = new Contract(
        tokenDetails.address.toLowerCase(),
        tokenDetails.abi,
        signer,
      );

      setState({
        ...value,
        poolTokenContract,
        tokenContract,
        tokenDetails,
      });
    });

    return () => sub.unsubscribe();
  }, [account, signer, subscribe]);

  const handleCloseModal = useCallback(() => push(null), [push]);

  const handleDeposit = useCallback(
    (amount: Decimal) =>
      onDeposit(amount, state?.tokenDetails!, state?.poolTokenContract!),
    [onDeposit, state?.poolTokenContract, state?.tokenDetails],
  );
  const handleWithdraw = useCallback(
    (amount: Decimal) =>
      onWithdraw(amount, state?.tokenDetails!, state?.poolTokenContract!),
    [onWithdraw, state?.poolTokenContract, state?.tokenDetails],
  );

  const items = useMemo(
    () => [
      {
        label: t(translations.lendingAdjust.deposit),
        content: <Deposit state={state!} onConfirm={handleDeposit} />,
      },
      {
        label: t(translations.lendingAdjust.withdraw),
        content: <Withdraw state={state!} onConfirm={handleWithdraw} />,
      },
    ],
    [handleDeposit, handleWithdraw, state],
  );

  return (
    <Dialog isOpen={state != null}>
      <DialogHeader
        title={t(translations.lendingAdjust.title)}
        onClose={handleCloseModal}
      />
      <DialogBody>
        <Tabs
          index={tab}
          onChange={setTab}
          items={items}
          className="w-full"
          contentClassName="px-4 py-4"
        />
      </DialogBody>
    </Dialog>
  );
};
