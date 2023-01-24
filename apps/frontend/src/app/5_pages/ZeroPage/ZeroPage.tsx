import {
  Decimalish,
  Fees,
  TroveAdjustmentParams,
  UserTrove,
} from '@sovryn-zero/lib-base';

import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';
import { Await, useLoaderData } from 'react-router-dom';

import { getContract } from '@sovryn/contracts';
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  Paragraph,
} from '@sovryn/ui';

import { LOCStatus } from '../../2_molecules/LOCStatus/LOCStatus';
import { SystemStats } from '../../2_molecules/SystemStats/SystemStats';
import { LOCChart } from '../../3_organisms/LOCChart/LOCChart';
import { AdjustCreditLine } from '../../3_organisms/ZeroLocForm/AdjustCreditLine';
import { CloseCreditLine } from '../../3_organisms/ZeroLocForm/CloseCreditLine';
import { DEBT_TOKEN } from '../../3_organisms/ZeroLocForm/constants';
import {
  CreditLineSubmitValue,
  CreditLineType,
} from '../../3_organisms/ZeroLocForm/types';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useWalletConnect } from '../../../hooks';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { getRskChainId } from '../../../utils/chain';
import {
  GAS_LIMIT_ADJUST_TROVE,
  GAS_LIMIT_OPEN_TROVE,
} from '../../../utils/constants';
import { ZeroPageLoaderData } from './loader';
import { adjustTrove, openTrove } from './utils/trove-manager';

export const ZeroPage: FC = () => {
  const { liquity, deferedData } = useLoaderData() as ZeroPageLoaderData;

  const { setTransactions, setIsOpen } = useTransactionContext();

  const [open, toggle] = useReducer(v => !v, false);
  const [openClosePopup, toggleClosePopup] = useReducer(v => !v, false);
  const [trove, setTrove] = useState<UserTrove>();
  const [zusdBalance, setZusdBalance] = React.useState('');

  const { connectWallet } = useWalletConnect();
  const { signer, account } = useAccount();

  useEffect(() => {
    if (account && liquity) {
      liquity.getTrove(account).then(setTrove);
    }
  }, [account, liquity]);

  useEffect(() => {
    const getZUSDBalance = async () => {
      const balance = (await liquity.getZUSDBalance(account)).toString();
      console.log('balance', balance);
      return balance;
    };

    if (account && liquity) {
      getZUSDBalance().then(setZusdBalance);
    }
  }, [account, liquity]);

  const collateral = useMemo(
    () => Number(trove?.collateral ?? 0),
    [trove?.collateral],
  );
  const debt = useMemo(() => Number(trove?.debt ?? 0), [trove?.debt]);

  const hasLoc = useMemo(() => trove?.debt?.gt(0), [trove?.debt]);

  const handleTroveSubmit = useCallback(
    async (value: CreditLineSubmitValue) => {
      if (signer) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          getRskChainId(),
        );

        const contract = new Contract(address, abi, signer);

        if (hasLoc) {
          const params: Partial<TroveAdjustmentParams<Decimalish>> = {};

          if (value.borrow) {
            params.borrowZUSD = value.borrow;
          }

          if (value.repay) {
            params.repayZUSD = value.repay;
          }

          if (value.depositCollateral) {
            params.depositCollateral = value.depositCollateral;
          }

          if (value.withdrawCollateral) {
            params.withdrawCollateral = value.withdrawCollateral;
          }

          const adjustedTrove = await adjustTrove(account, params);
          setTransactions([
            {
              title: t(translations.zeroPage.tx.adjustTrove),
              contract,
              fnName: 'adjustTrove',
              config: {
                value: adjustedTrove.value,
                gasLimit: GAS_LIMIT_ADJUST_TROVE,
              },
              args: adjustedTrove.args,
            },
          ]);
          setIsOpen(true);
        } else {
          const openedTrove = await openTrove({
            borrowZUSD: value.borrow || '0',
            depositCollateral: value.depositCollateral || '0',
          });
          setTransactions([
            {
              title: t(translations.zeroPage.tx.openTrove),
              contract,
              fnName: 'openTrove',
              config: {
                value: openedTrove.value,
                gasLimit: GAS_LIMIT_OPEN_TROVE,
              },
              args: openedTrove.args,
            },
          ]);
          setIsOpen(true);
        }
      }
    },
    [account, hasLoc, setIsOpen, setTransactions, signer],
  );

  const handleTroveClose = useCallback(async () => {
    if (signer) {
      const { address, abi } = await getContract(
        'borrowerOperations',
        'zero',
        getRskChainId(),
      );

      const contract = new Contract(address, abi, signer);

      setTransactions([
        {
          title: t(translations.zeroPage.tx.closeTrove),
          contract,
          fnName: 'closeTrove',
          args: [],
        },
      ]);
      setIsOpen(true);
    }
  }, [setIsOpen, setTransactions, signer]);

  const getRatio = useCallback(
    (price: string) => {
      return ((collateral * Number(price)) / debt) * 100;
    },
    [collateral, debt],
  );

  return (
    <div className="container max-w-7xl mt-24">
      <React.Suspense fallback={<p>Loading stuff...</p>}>
        <Await resolve={deferedData} errorElement={<p>Error loading stuff!</p>}>
          {([price, fees]: [string, Fees]) => (
            <>
              {account ? (
                <>
                  {hasLoc ? (
                    <LOCStatus
                      collateral={collateral}
                      debt={debt}
                      cRatio={getRatio(price)}
                      debtSymbol={DEBT_TOKEN.toUpperCase()}
                      onAdjust={toggle}
                      onClose={toggleClosePopup}
                    />
                  ) : (
                    <>
                      <Paragraph>****** It should be banner....</Paragraph>
                      <div className="mt-8">
                        <Button
                          text={t(translations.zeroPage.loc.open)}
                          onClick={toggle}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button text="Connect first...." onClick={connectWallet} />
                  <hr />
                  <br />
                  <SystemStats />
                </>
              )}
              <LOCChart />

              <Dialog width={DialogSize.sm} isOpen={open} disableFocusTrap>
                <DialogHeader
                  title={
                    !hasLoc
                      ? t(translations.zeroPage.loc.open)
                      : t(translations.zeroPage.loc.adjust)
                  }
                  onClose={toggle}
                />
                <DialogBody>
                  {open && (
                    <AdjustCreditLine
                      type={
                        !hasLoc ? CreditLineType.Open : CreditLineType.Adjust
                      }
                      existingCollateral={String(collateral)}
                      existingDebt={String(debt)}
                      onSubmit={handleTroveSubmit}
                      rbtcPrice={price}
                      fees={fees}
                    />
                  )}
                </DialogBody>
              </Dialog>

              <Dialog
                width={DialogSize.sm}
                isOpen={openClosePopup}
                disableFocusTrap
              >
                <DialogHeader
                  title={t(translations.zeroPage.loc.close)}
                  onClose={toggleClosePopup}
                />
                <DialogBody>
                  <CloseCreditLine
                    onSubmit={handleTroveClose}
                    creditValue={String(debt)}
                    collateralValue={String(collateral)}
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
