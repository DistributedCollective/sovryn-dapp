import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import {
  AssetDetailsData,
  getAssetData,
  getLoanTokenContract,
} from '@sovryn/contracts';
import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { eventDriven } from '../../../../../store/rxjs/event-driven';
import { asyncCall } from '../../../../../store/rxjs/provider-cache';
import { Nullable } from '../../../../../types/global';
import { LendModalAction } from '../../LendPage.types';
import { FormType, LendingForm } from './LendingForm';

export type AdjustModalProps = {
  onDeposit: (amount: Decimal, token: AssetDetailsData, pool: Contract) => void;
  onWithdraw: (
    amount: Decimal,
    token: AssetDetailsData,
    pool: Contract,
  ) => void;
  onClose: () => void;
  isOpen: boolean;
};

export type FullAdjustModalState = {
  token: string;
  apr: Decimal;
  balance: Decimal;
  liquidity: Decimal;
  poolTokenContract: Contract;
  tokenContract: Contract;
  tokenDetails: AssetDetailsData;
};

export const AdjustLendingModalContainer: FC<AdjustModalProps> = ({
  onDeposit,
  onWithdraw,
  onClose,
  isOpen,
}) => {
  const { subscribe, push } = useMemo(
    () => eventDriven<Nullable<string>>(LendModalAction.Adjust),
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

      const poolToken = await getLoanTokenContract(value, RSK_CHAIN_ID);

      if (!poolToken) {
        setState(null);
        return;
      }

      const tokenDetails = await getAssetData(value, RSK_CHAIN_ID);

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

      const apr = await asyncCall(
        `poolToken/${poolToken.address}/nextSupplyInterestRate`,
        () => poolTokenContract?.nextSupplyInterestRate('0'),
      ).then(Decimal.fromBigNumberString);

      setState({
        token: value,
        balance,
        liquidity,
        apr,
        poolTokenContract,
        tokenContract,
        tokenDetails,
      });
    });

    return () => sub.unsubscribe();
  }, [account, signer, subscribe]);

  const handleCloseModal = useCallback(() => {
    push(null);
    onClose();
  }, [onClose, push]);

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
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(translations.lendingAdjust.title)}
        onClose={handleCloseModal}
      />
      <DialogBody>
        {state != null && (
          <>
            <div className="bg-gray-90 p-4 rounded">
              <CurrentStatistics
                symbol={state.token}
                label1={t(translations.lendingAdjust.apr)}
                label2={t(translations.lendingAdjust.currentBalance)}
                value1={<AmountRenderer value={state.apr} suffix="%" />}
                value2={
                  <AmountRenderer
                    value={state.balance}
                    suffix={getTokenDisplayName(state.token)}
                  />
                }
              />
            </div>
            <LendingForm state={state} onConfirm={handleConfirm} />
          </>
        )}
      </DialogBody>
    </Dialog>
  );
};
