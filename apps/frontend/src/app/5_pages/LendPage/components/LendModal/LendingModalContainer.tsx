import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import {
  SupportedTokens,
  TokenDetailsData,
  getLoanTokenContract,
  getTokenDetails,
} from '@sovryn/contracts';
import { Dialog, DialogBody, DialogHeader, DialogSize } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../config/chains';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { eventDriven } from '../../../../../store/rxjs/event-driven';
import { Nullable } from '../../../../../types/global';
import { LendModalAction } from '../../LendPage.types';
import { CurrentStats } from './CurrentStats';
import { LendingForm } from './LendingForm';

export type LendingModalProps = {
  onDeposit: (amount: Decimal, token: TokenDetailsData, pool: Contract) => void;
};

export type LendingModalState = {
  // deposit token
  token: SupportedTokens;
  // lending pool APY
  apy: Decimal;
};

export type FullLendingModalState = LendingModalState & {
  poolTokenContract: Contract;
  tokenContract: Contract;
  tokenDetails: TokenDetailsData;
};

export const LendingModalContainer: FC<LendingModalProps> = ({ onDeposit }) => {
  const { subscribe, push } = useMemo(
    () => eventDriven<Nullable<LendingModalState>>(LendModalAction.Lend),
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

      const poolToken = await getLoanTokenContract(value.token, defaultChainId);
      if (!poolToken) {
        setState(null);
        return;
      }

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
    <Dialog width={DialogSize.sm} isOpen={state != null}>
      <DialogHeader
        title={t(translations.lending.title)}
        onClose={handleCloseModal}
      />
      <DialogBody>
        {state != null && (
          <>
            <CurrentStats token={state.token} apy={state.apy} />
            <LendingForm state={state} onConfirm={handleConfirm} />
          </>
        )}
      </DialogBody>
    </Dialog>
  );
};
