import { Decimal, Fees, UserTrove } from '@sovryn-zero/lib-base';

import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { t } from 'i18next';
import { Await, useLoaderData } from 'react-router-dom';

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
import { GettingStartedPopup } from '../../3_organisms/GettingStartedPopup/GettingStartedPopup';
import { LOCChart } from '../../3_organisms/LOCChart/LOCChart';
import { useGetUserOpenTrove } from '../../3_organisms/LOCChart/hooks/useGetUserOpenTrove';
import { AdjustCreditLine } from '../../3_organisms/ZeroLocForm/AdjustCreditLine';
import { CloseCreditLine } from '../../3_organisms/ZeroLocForm/CloseCreditLine';
import { DEBT_TOKEN } from '../../3_organisms/ZeroLocForm/constants';
import { CreditLineType } from '../../3_organisms/ZeroLocForm/types';
import { useWalletConnect } from '../../../hooks';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { LIQUIDATION_RESERVE_AMOUNT } from '../../../utils/constants';
import { useClaimCollateralSurplus } from './hooks/useClaimCollateralSurplus';
import { useHandleTrove } from './hooks/useHandleTrove';
import { ZeroPageLoaderData } from './loader';

export const ZeroPage: FC = () => {
  const { liquity, deferedData } = useLoaderData() as ZeroPageLoaderData;

  const [open, toggle] = useReducer(v => !v, false);
  const [openStartedPopup, toggleStartedPopup] = useReducer(v => !v, false);
  const [openClosePopup, toggleClosePopup] = useReducer(v => !v, false);
  const [trove, setTrove] = useState<UserTrove>();
  const [zusdBalance, setZusdBalance] = React.useState('');
  const [collateralSurplusBalance, setCollateralSurplusBalance] =
    useState<Decimal>();

  const { connectWallet } = useWalletConnect();
  const { account } = useAccount();

  const collateral = useMemo(
    () => Number(trove?.collateral ?? 0),
    [trove?.collateral],
  );
  const debt = useMemo(() => Number(trove?.debt ?? 0), [trove?.debt]);
  const hasLoc = useMemo(() => !!trove?.debt?.gt(0), [trove?.debt]);
  const { refetch: getOpenTroves } = useGetUserOpenTrove();

  const handleLOCPopup = useCallback(() => {
    toggle();
    toggleStartedPopup();
  }, []);

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

  const getTroves = useCallback(() => {
    if (account && liquity) {
      liquity.getTrove(account).then(setTrove);
    }
  }, [account, liquity]);
  const getCollateralSurplusBalance = useCallback(() => {
    if (account && liquity) {
      liquity
        .getCollateralSurplusBalance(account)
        .then(setCollateralSurplusBalance);
    }
  }, [account, liquity]);
  const getZUSDBalance = useCallback(async () => {
    const balance = (await liquity.getZUSDBalance(account)).toString();
    setZusdBalance(balance);
  }, [account, liquity]);

  const claimCollateralSurplus = useClaimCollateralSurplus(
    getCollateralSurplusBalance,
  );
  const { handleTroveSubmit, handleTroveClose } = useHandleTrove(hasLoc, () => {
    toggle();
    getTroves();
    getOpenTroves();
    getZUSDBalance();
  });

  useEffect(() => {
    getTroves();
    getCollateralSurplusBalance();
  }, [account, liquity, getTroves, getCollateralSurplusBalance]);

  useEffect(() => {
    if (account && liquity) {
      getZUSDBalance();
    }
  }, [account, liquity, getZUSDBalance]);

  const getRatio = useCallback(
    (price: string) => {
      return ((collateral * Number(price)) / debt) * 100;
    },
    [collateral, debt],
  );

  return (
    <div className="px-0 container max-w-[100rem] md:mt-16 md:mb-40 mt-4 mb-7">
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
                  openLOC={toggleStartedPopup}
                  connectWallet={connectWallet}
                />
              )}

              <div className="flex-col-reverse lg:flex-row flex items-stretch md:p-6 md:bg-gray-90 rounded gap-9 md:gap-20">
                <div className="md:min-w-[23rem] min-w-auto">
                  <SystemStats />
                </div>
                <div className="md:hidden flex items-center w-full gap-3 mb-6">
                  {collateralSurplusBalance?.gt(0) && (
                    <Button
                      text={t(translations.LOCStatus.withdraw)}
                      style={ButtonStyle.primary}
                      size={ButtonSize.large}
                      onClick={claimCollateralSurplus}
                      className="flex-1"
                      dataAttribute="zero-loc-withdraw-surplus"
                    />
                  )}
                  {hasLoc && (
                    <>
                      <Button
                        text={t(translations.LOCStatus.adjust)}
                        style={ButtonStyle.primary}
                        size={ButtonSize.large}
                        onClick={toggle}
                        className="flex-1"
                        dataAttribute="zero-adjust"
                      />
                      <Button
                        text={t(translations.LOCStatus.close)}
                        style={ButtonStyle.secondary}
                        size={ButtonSize.large}
                        onClick={toggleClosePopup}
                        className="flex-1"
                        dataAttribute="zero-close"
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

                  <div className="h-80 md:flex-1 bg-gray-80 rounded pt-2 pr-2 flex items-center">
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

              <GettingStartedPopup
                isOpen={openStartedPopup}
                onConfirm={handleLOCPopup}
              />

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
                    creditValue={String(debt - LIQUIDATION_RESERVE_AMOUNT)}
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
