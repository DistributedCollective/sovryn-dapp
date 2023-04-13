import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';

import { Fees, UserTrove } from '@sovryn-zero/lib-base';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { withDeferredLoaderData } from '../../0_meta/DeferredDataLoader/withDeferredRouterData';
import { DashboardWelcomeBanner } from '../../2_molecules/DashboardWelcomeBanner/DashboardWelcomeBanner';
import { LOCStatus } from '../../2_molecules/LOCStatus/LOCStatus';
import { SystemStats } from '../../2_molecules/SystemStats/SystemStats';
import { GettingStartedPopup } from '../../3_organisms/GettingStartedPopup/GettingStartedPopup';
import { LOCChart } from '../../3_organisms/LOCChart/LOCChart';
import { useGetUserOpenTrove } from '../../3_organisms/LOCChart/hooks/useGetUserOpenTrove';
import { CloseCreditLine } from '../../3_organisms/ZeroLocForm/CloseCreditLine';
import { AdjustCreditLine } from '../../3_organisms/ZeroLocForm/components/AdjustCreditLine';
import { OpenCreditLine } from '../../3_organisms/ZeroLocForm/components/OpenCreditLine';
import { DEBT_TOKEN } from '../../3_organisms/ZeroLocForm/constants';
import { LIQUIDATION_RESERVE_AMOUNT } from '../../../constants/general';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useWalletConnect } from '../../../hooks';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { decimalic } from '../../../utils/math';
import { useClaimCollateralSurplus } from './hooks/useClaimCollateralSurplus';
import { useHandleTrove } from './hooks/useHandleTrove';
import { useLiquityBaseParams } from './hooks/useLiquityBaseParams';
import { ZeroPageLoaderData } from './loader';

type ZeroPageProps = {
  deferred: [Decimal, Fees];
};

const ZeroPage: FC<ZeroPageProps> = ({ deferred: [price, fees] }) => {
  const { liquity } = useLoaderData() as ZeroPageLoaderData;

  const { isOpen: isTxOpen } = useTransactionContext();
  const [open, toggle] = useReducer(v => !v, false);
  const [openStartedPopup, toggleStartedPopup] = useReducer(v => !v, false);
  const [openClosePopup, toggleClosePopup] = useReducer(v => !v, false);
  const [trove, setTrove] = useState<UserTrove>();
  const [collateralSurplusBalance, setCollateralSurplusBalance] =
    useState<Decimal>();

  const { connectWallet } = useWalletConnect();
  const { account } = useAccount();
  const { refetch: getOpenTroves } = useGetUserOpenTrove(account);
  const { minBorrowingFeeRate } = useLiquityBaseParams();

  const collateral = useMemo(
    () => decimalic(trove?.collateral?.toString()),
    [trove?.collateral],
  );
  const debt = useMemo(() => decimalic(trove?.debt?.toString()), [trove?.debt]);
  const hasLoc = useMemo(() => !!trove?.debt?.gt(0), [trove?.debt]);

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
        .then(String)
        .then(Decimal.from)
        .then(setCollateralSurplusBalance);
    }
  }, [account, liquity]);

  const claimCollateralSurplus = useClaimCollateralSurplus(
    getCollateralSurplusBalance,
  );
  const { handleTroveSubmit, handleTroveClose } = useHandleTrove(hasLoc, {
    onTroveOpened: () => {
      toggle();
      toggleStartedPopup();
      getTroves();
      getOpenTroves();
    },
    onTroveAdjusted: () => {
      toggle();
      getTroves();
      getOpenTroves();
    },
    onTroveClosed: () => {
      toggleClosePopup();
      getTroves();
      getOpenTroves();
    },
  });

  useEffect(() => {
    getTroves();
    getCollateralSurplusBalance();
  }, [account, liquity, getTroves, getCollateralSurplusBalance]);

  const getRatio = useCallback(
    (price: Decimal) => collateral.mul(price).div(debt).mul(100),
    [collateral, debt],
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.zeroPage.meta.title)}</title>
      </Helmet>
      <div className="px-0 container max-w-[100rem] md:mb-2 mt-4 mb-7">
        {!showWelcomeBanner && !isLoading && (
          <LOCStatus
            className="mb-6"
            collateral={collateral}
            debt={debt}
            cRatio={getRatio(price)}
            debtSymbol={DEBT_TOKEN.toUpperCase()}
            onAdjust={toggle}
            onClose={toggleClosePopup}
            withdrawalSurplus={collateralSurplusBalance}
            onWithdraw={claimCollateralSurplus}
          />
        )}

        {showWelcomeBanner && !isLoading && (
          <DashboardWelcomeBanner
            openLOC={toggle}
            connectWallet={connectWallet}
            className="mb-10 md:mb-4"
          />
        )}

        <div className="flex-col-reverse lg:flex-row flex items-stretch md:p-4 md:bg-gray-90 rounded gap-9 md:gap-20">
          <div className="md:min-w-[23rem] min-w-auto">
            <SystemStats />
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

        <Dialog width={DialogSize.md} isOpen={open} disableFocusTrap>
          <DialogHeader
            title={
              !hasLoc
                ? t(translations.zeroPage.loc.open)
                : t(translations.zeroPage.loc.adjust)
            }
            onClose={toggle}
          />
          <DialogBody>
            {open && !hasLoc && (
              <OpenCreditLine
                onSubmit={handleTroveSubmit}
                rbtcPrice={price}
                borrowingRate={minBorrowingFeeRate}
              />
            )}
            {open && hasLoc && (
              <AdjustCreditLine
                existingCollateral={collateral}
                existingDebt={debt}
                rbtcPrice={price}
                borrowingRate={minBorrowingFeeRate}
                onSubmit={handleTroveSubmit}
              />
            )}
          </DialogBody>
        </Dialog>

        <GettingStartedPopup
          isOpen={openStartedPopup && !isTxOpen}
          onConfirm={toggleStartedPopup}
        />

        <Dialog width={DialogSize.md} isOpen={openClosePopup} disableFocusTrap>
          <DialogHeader
            title={t(translations.zeroPage.loc.close)}
            onClose={toggleClosePopup}
          />
          <DialogBody>
            <CloseCreditLine
              onSubmit={handleTroveClose}
              creditValue={debt.sub(LIQUIDATION_RESERVE_AMOUNT)}
              collateralValue={collateral}
              rbtcPrice={price}
            />
          </DialogBody>
        </Dialog>
      </div>
    </>
  );
};

export default withDeferredLoaderData(ZeroPage, 'deferredData');
