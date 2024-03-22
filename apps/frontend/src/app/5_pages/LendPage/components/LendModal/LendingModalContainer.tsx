import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import {
  AssetDetailsData,
  getAssetData,
  getLoanTokenContract,
} from '@sovryn/contracts';
import { Dialog, DialogBody, DialogHeader, DialogSize } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { eventDriven } from '../../../../../store/rxjs/event-driven';
import { asyncCall } from '../../../../../store/rxjs/provider-cache';
import { Nullable } from '../../../../../types/global';
import { LendModalAction } from '../../LendPage.types';
import { CurrentStats } from './CurrentStats';
import { LendingForm } from './LendingForm';

export type LendingModalProps = {
  onDeposit: (amount: Decimal, token: AssetDetailsData, pool: Contract) => void;
  onClose: () => void;
  isOpen: boolean;
};

export type FullLendingModalState = {
  token: string;
  apr: Decimal;
  poolTokenContract: Contract;
  tokenContract: Contract;
  tokenDetails: AssetDetailsData;
};

export const LendingModalContainer: FC<LendingModalProps> = ({
  onDeposit,
  onClose,
  isOpen,
}) => {
  const { subscribe, push } = useMemo(
    () => eventDriven<Nullable<string>>(LendModalAction.Lend),
    [],
  );

  const { signer, account } = useAccount();

  const [state, setState] = useState<Nullable<FullLendingModalState>>(null);

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

      const apr = await asyncCall(
        `poolToken/${poolToken.address}/nextSupplyInterestRate`,
        () => poolTokenContract?.nextSupplyInterestRate('0'),
      ).then(Decimal.fromBigNumberString);

      setState({
        token: value,
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
    (amount: Decimal) => {
      if (state == null) {
        return;
      }
      onDeposit(amount, state.tokenDetails, state.poolTokenContract);
    },
    [onDeposit, state],
  );

  return (
    <Dialog disableFocusTrap width={DialogSize.sm} isOpen={isOpen}>
      <DialogHeader
        title={t(translations.lending.title)}
        onClose={handleCloseModal}
      />
      <DialogBody>
        {state != null && (
          <>
            <CurrentStats token={state.token} apr={state.apr} />
            <LendingForm state={state} onConfirm={handleConfirm} />
          </>
        )}
      </DialogBody>
    </Dialog>
  );
};
