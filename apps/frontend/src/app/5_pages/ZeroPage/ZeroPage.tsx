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

import { UserTrove } from '@sovryn-zero/lib-base';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  ErrorBadge,
  ErrorLevel,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { withDeferredLoaderData } from '../../0_meta/DeferredDataLoader/withDeferredRouterData';
import { LOCStatus } from '../../2_molecules/LOCStatus/LOCStatus';
import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { SystemStats } from '../../2_molecules/SystemStats/SystemStats';
import { GettingStartedPopup } from '../../3_organisms/GettingStartedPopup/GettingStartedPopup';
import { LOCChart } from '../../3_organisms/LOCChart/LOCChart';
import { useGetUserOpenTrove } from '../../3_organisms/LOCChart/hooks/useGetUserOpenTrove';
import { CloseCreditLine } from '../../3_organisms/ZeroLocForm/CloseCreditLine';
import { AdjustCreditLine } from '../../3_organisms/ZeroLocForm/components/AdjustCreditLine';
import { OpenCreditLine } from '../../3_organisms/ZeroLocForm/components/OpenCreditLine';
import { DEBT_TOKEN } from '../../3_organisms/ZeroLocForm/constants';
import { LIQUIDATION_RESERVE_AMOUNT } from '../../../constants/general';
import { getTokenDisplayName } from '../../../constants/tokens';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useAccount } from '../../../hooks/useAccount';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import { decimalic } from '../../../utils/math';
import { OpenLocButton } from './components/OpenLocButton/OpenLocButton';
import { RedemptionDialog } from './components/RedemptionDialog/RedemptionDialog';
import { RedemptionDialogButton } from './components/RedemptionDialog/RedemptionDialogButton';
import { useClaimCollateralSurplus } from './hooks/useClaimCollateralSurplus';
import { useHandleTrove } from './hooks/useHandleTrove';
import { useLiquityBaseParams } from './hooks/useLiquityBaseParams';
import { ZeroPageLoaderData } from './loader';

type ZeroPageProps = {
  deferred: [Decimal];
};

const ZeroPage: FC<ZeroPageProps> = ({ deferred: [price] }) => {
  const { liquity } = useLoaderData() as ZeroPageLoaderData;
  const { checkMaintenance, States } = useMaintenance();
  const openLocLocked = checkMaintenance(States.ZERO_OPEN_LOC);

  const { isOpen: isTxOpen } = useTransactionContext();
  const [open, toggle] = useReducer(v => !v, false);
  const [openStartedPopup, toggleStartedPopup] = useReducer(v => !v, false);
  const [openClosePopup, toggleClosePopup] = useReducer(v => !v, false);
  const [trove, setTrove] = useState<UserTrove>();
  const [collateralSurplusBalance, setCollateralSurplusBalance] =
    useState<Decimal>();

  const { account } = useAccount();
  const { refetch: getOpenTroves } = useGetUserOpenTrove(account);
  const { minBorrowingFeeRate } = useLiquityBaseParams();

  const [hasUserClosedTrove, setHasUserClosedTrove] = useState(false);

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
      setHasUserClosedTrove(false);
      getTroves();
      getOpenTroves();
    },
    onTroveAdjusted: () => {
      toggle();
      getTroves();
      getOpenTroves();
    },
    onTroveClosed: () => {
      setHasUserClosedTrove(true);
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
      <div className="px-0 container lg:mx-8 mb-7">
        <NetworkBanner requiredChainId={RSK_CHAIN_ID}>
          <RedemptionDialog />

          {!account && <div className="mt-6 lg:mt-12"></div>}
          {account && !showWelcomeBanner && !isLoading && (
            <LOCStatus
              className="mt-4 mb-6"
              collateral={collateral}
              debt={debt}
              cRatio={getRatio(price)}
              debtSymbol={getTokenDisplayName(DEBT_TOKEN)}
              onAdjust={toggle}
              onClose={toggleClosePopup}
              withdrawalSurplus={collateralSurplusBalance}
              onWithdraw={claimCollateralSurplus}
            />
          )}
          {account && showWelcomeBanner && !isLoading && !openLocLocked && (
            <div className="mt-6 lg:mt-12 flex justify-end gap-x-4 mb-10 md:mb-4">
              <OpenLocButton openLOC={toggle} />
              <RedemptionDialogButton />
            </div>
          )}

          {openLocLocked && !hasLoc && !isLoading && (
            <div className="my-2 flex justify-center">
              <ErrorBadge
                className="px-8"
                level={ErrorLevel.Warning}
                message={t(translations.maintenanceMode.openingLOC)}
              />
            </div>
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
                <LOCChart hasUserClosedTrove={hasUserClosedTrove} />
              </div>
            </div>
          </div>

          <p className="mt-4 px-2">
            <a
              href="https://wiki.sovryn.com/en/sovryn-dapp/subprotocols/zero-zusd"
              target="_blank"
              rel="nofollow noreferrer"
            >
              Learn More
            </a>
          </p>

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

          <Dialog
            width={DialogSize.md}
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
                creditValue={debt.sub(LIQUIDATION_RESERVE_AMOUNT)}
                collateralValue={collateral}
                rbtcPrice={price}
              />
            </DialogBody>
          </Dialog>
        </NetworkBanner>
      </div>
    </>
  );
};

export default withDeferredLoaderData(ZeroPage, 'deferredData');
