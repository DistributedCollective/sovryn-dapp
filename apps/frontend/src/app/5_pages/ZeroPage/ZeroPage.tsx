import {
  Decimal,
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
  ButtonSize,
  ButtonStyle,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';

import { DashboardWelcomeBanner } from '../../2_molecules/DashboardWelcomeBanner/DashboardWelcomeBanner';
import { LOCStatus } from '../../2_molecules/LOCStatus/LOCStatus';
import { SystemStats } from '../../2_molecules/SystemStats/SystemStats';
import { LOCChart } from '../../3_organisms/LOCChart/LOCChart';
import { useGetUserOpenTrove } from '../../3_organisms/LOCChart/hooks/useGetUserOpenTrove';
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
import { useClaimCollateralSurplus } from './hooks/useClaimCollateralSurplus';
import { ZeroPageLoaderData } from './loader';
import { adjustTrove, openTrove } from './utils/trove-manager';

export const ZeroPage: FC = () => {
  const { liquity, deferedData } = useLoaderData() as ZeroPageLoaderData;

  const { setTransactions, setIsOpen } = useTransactionContext();

  const [open, toggle] = useReducer(v => !v, false);
  const [openClosePopup, toggleClosePopup] = useReducer(v => !v, false);
  const [trove, setTrove] = useState<UserTrove>();
  const [zusdBalance, setZusdBalance] = React.useState('');
  const [collateralSurplusBalance, setCollateralSurplusBalance] =
    useState<Decimal>();

  const { refetch } = useGetUserOpenTrove();

  const { connectWallet } = useWalletConnect();
  const { signer, account } = useAccount();
  const claimCollateralSurplus = useClaimCollateralSurplus();

  const getTroves = useCallback(() => {
    if (account && liquity) {
      liquity.getTrove(account).then(setTrove);
    }
  }, [account, liquity]);

  useEffect(() => {
    if (account && liquity) {
      getTroves();
      liquity
        .getCollateralSurplusBalance(account)
        .then(setCollateralSurplusBalance);
    }
  }, [account, liquity, getTroves]);

  useEffect(() => {
    const getZUSDBalance = async () => {
      const balance = (await liquity.getZUSDBalance(account)).toString();
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
  const isLoading = useMemo(
    () =>
      account &&
      (trove === undefined || collateralSurplusBalance === undefined),
    [account, collateralSurplusBalance, trove],
  );

  const showWelcomeBanner = useMemo(
    () => !account || (!hasLoc && collateralSurplusBalance?.eq(0)),
    [account, collateralSurplusBalance, hasLoc],
  );

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
              onComplete: () => {
                getTroves();
                refetch();
              },
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
              onComplete: () => {
                refetch();
                getTroves();
              },
            },
          ]);
          setIsOpen(true);
        }
      }
    },
    [account, hasLoc, setIsOpen, setTransactions, signer, getTroves, refetch],
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
          onComplete: () => {
            refetch();
            getTroves();
          },
        },
      ]);
      setIsOpen(true);
    }
  }, [setIsOpen, setTransactions, signer, getTroves, refetch]);

  const getRatio = useCallback(
    (price: string) => {
      return ((collateral * Number(price)) / debt) * 100;
    },
    [collateral, debt],
  );

  return (
    <div className="container max-w-7xl md:mt-16 md:mb-40 mt-4 mb-7">
      <React.Suspense fallback={<p>Loading stuff...</p>}>
        <Await resolve={deferedData} errorElement={<p>Error loading stuff!</p>}>
          {([price, fees]: [string, Fees]) => (
            <>
              {!showWelcomeBanner && !isLoading && (
                <LOCStatus
                  className="mb-6"
                  collateral={collateral}
                  debt={debt}
                  cRatio={getRatio(price)}
                  debtSymbol={DEBT_TOKEN.toUpperCase()}
                  onAdjust={toggle}
                  onClose={toggleClosePopup}
                  withdrawalSurplus={Number(
                    collateralSurplusBalance?.toString(),
                  )}
                  onWithdraw={claimCollateralSurplus}
                />
              )}
              {showWelcomeBanner && !isLoading && (
                <DashboardWelcomeBanner
                  openLOC={toggle}
                  connectWallet={connectWallet}
                />
              )}

              <div className="flex-col-reverse lg:flex-row flex items-stretch md:bg-gray-90 md:p-6 rounded gap-9 md:gap-20">
                <div className="md:min-w-[23rem] min-w-auto">
                  <SystemStats />
                </div>
                <div className="md:hidden flex items-center w-full gap-3 mb-6">
                  {collateralSurplusBalance?.gt(0) && (
                    <Button
                      text={t('LOCStatus.withdraw')}
                      style={ButtonStyle.primary}
                      size={ButtonSize.large}
                      onClick={claimCollateralSurplus}
                      className="flex-1"
                    />
                  )}
                  {hasLoc && (
                    <>
                      <Button
                        text={t('LOCStatus.adjust')}
                        style={ButtonStyle.primary}
                        size={ButtonSize.large}
                        onClick={toggle}
                        className="flex-1"
                      />
                      <Button
                        text={t('LOCStatus.close')}
                        style={ButtonStyle.secondary}
                        size={ButtonSize.large}
                        onClick={toggleClosePopup}
                        className="flex-1"
                      />
                    </>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <Paragraph
                    size={ParagraphSize.base}
                    style={ParagraphStyle.normal}
                    className="mb-3 md:mb-6"
                  >
                    {t(translations.chart.systemLinesCredit)}
                  </Paragraph>

                  <div className="h-80 md:flex-1 bg-gray-80 rounded pt-2 px-2 flex items-center">
                    <LOCChart />
                  </div>
                </div>
              </div>

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
                  <AdjustCreditLine
                    type={!hasLoc ? CreditLineType.Open : CreditLineType.Adjust}
                    existingCollateral={String(collateral)}
                    existingDebt={String(debt)}
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
