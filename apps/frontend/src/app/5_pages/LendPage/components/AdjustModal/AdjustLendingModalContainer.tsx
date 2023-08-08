import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import {
  SupportedTokens,
  TokenDetailsData,
  getLoanTokenContract,
  getTokenDetails,
} from '@sovryn/contracts';
import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../config/chains';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { eventDriven } from '../../../../../store/rxjs/event-driven';
import { asyncCall } from '../../../../../store/rxjs/provider-cache';
import { Nullable } from '../../../../../types/global';
import { LendModalAction } from '../../LendPage.types';
import { CurrentStats } from './CurrentStats';
import { FormType, LendingForm } from './LendingForm';

export type AdjustModalProps = {
  onDeposit: (amount: Decimal, token: TokenDetailsData, pool: Contract) => void;
  onWithdraw: (
    amount: Decimal,
    token: TokenDetailsData,
    pool: Contract,
  ) => void;
};

export type FullAdjustModalState = {
  token: SupportedTokens;
  apy: Decimal;
  balance: Decimal;
  liquidity: Decimal;
  poolTokenContract: Contract;
  tokenContract: Contract;
  tokenDetails: TokenDetailsData;
};

export const AdjustLendingModalContainer: FC<AdjustModalProps> = ({
  onDeposit,
  onWithdraw,
}) => {
  const { subscribe, push } = useMemo(
    () => eventDriven<Nullable<SupportedTokens>>(LendModalAction.Adjust),
    [],
  );

  const { signer, account } = useAccount();

  const [state, setState] = useState<Nullable<FullAdjustModalState>>(null);

  useEffect(() => {
    const sub = subscribe(async value => {
      if (value == null || signer == null || account == null) {
        setState(null);
        return;
      }

      const poolToken = await getLoanTokenContract(value, defaultChainId);

      if (!poolToken) {
        setState(null);
        return;
      }

      const tokenDetails = await getTokenDetails(value, defaultChainId);

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

      const balance = await asyncCall(
        `poolToken/${poolToken.address}/assetBalanceOf/${account}`,
        () => poolTokenContract?.assetBalanceOf(account),
      ).then(Decimal.fromBigNumberString);

      const liquidity = await asyncCall(
        `poolToken/${poolToken.address}/marketLiquidity`,
        () => poolTokenContract?.marketLiquidity(),
      ).then(Decimal.fromBigNumberString);

      const apy = await asyncCall(
        `poolToken/${poolToken.address}/nextSupplyInterestRate`,
        () => poolTokenContract?.nextSupplyInterestRate('0'),
      ).then(Decimal.fromBigNumberString);

      setState({
        token: value,
        balance,
        liquidity,
        apy,
        poolTokenContract,
        tokenContract,
        tokenDetails,
      });
    });

    return () => sub.unsubscribe();
  }, [account, signer, subscribe]);

  const handleCloseModal = useCallback(() => push(null), [push]);

  const handleConfirm = useCallback(
    (type: FormType, amount: Decimal) => {
      if (state == null) {
        return;
      }
      if (type === FormType.Deposit) {
        onDeposit(amount, state.tokenDetails, state.poolTokenContract);
      } else {
        onWithdraw(amount, state.tokenDetails, state.poolTokenContract);
      }
    },
    [onDeposit, onWithdraw, state],
  );

  return (
    <Dialog disableFocusTrap isOpen={state != null}>
      <DialogHeader
        title={t(translations.lendingAdjust.title)}
        onClose={handleCloseModal}
      />
      <DialogBody>
        {state != null && (
          <>
            <CurrentStats
              symbol={state.token}
              apy={state.apy}
              balance={state.balance}
            />
            <LendingForm state={state} onConfirm={handleConfirm} />
          </>
        )}
      </DialogBody>
    </Dialog>
  );
};
