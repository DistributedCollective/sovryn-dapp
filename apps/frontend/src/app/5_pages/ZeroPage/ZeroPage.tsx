import { Decimal, Fees, UserTrove } from '@sovryn-zero/lib-base';
import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';

import React, { FC, useEffect, useMemo, useReducer, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  noop,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';

import { DashboardWelcomeBanner } from '../../2_molecules/DashboardWelcomeBanner/DashboardWelcomeBanner';
import { LOCStatus } from '../../2_molecules/LOCStatus/LOCStatus';
import { SystemStats } from '../../2_molecules/SystemStats/SystemStats';
import { TransactionStepDialog } from '../../3_organisms';
import { LOCChart } from '../../3_organisms/LOCChart/LOCChart';
import { AdjustCreditLine } from '../../3_organisms/ZeroLocForm/AdjustCreditLine';
import { CloseCreditLine } from '../../3_organisms/ZeroLocForm/CloseCreditLine';
import { useWalletConnect } from '../../../hooks';
import { translations } from '../../../locales/i18n';
import { formatValue } from '../../../utils/math';
import { useClaimCollateralSurplus } from './hooks/useClaimCollateralSurplus';
import { useLOC } from './hooks/useLOC';

export const ZeroPage: FC = () => {
  const { t } = useTranslation();
  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquity;
  };

  const [openAdjust, toggleOpenAdjust] = useReducer(v => !v, false);
  const [openClosePopup, toggleClosePopup] = useReducer(v => !v, false);
  const [trove, setTrove] = useState<UserTrove>();
  const [price, setPrice] = useState<Decimal>();
  const [collateralSurplusBalance, setCollateralSurplusBalance] =
    useState<Decimal>();
  const [btcPrice, setBtcPrice] = useState('0');
  const [fees, setFees] = useState<Fees>();
  const [zusdBalance, setZusdBalance] = React.useState('');
  const { account } = useWalletConnect();

  const claimCollateralSurplus = useClaimCollateralSurplus();
  const { closeLOC } = useLOC();

  useEffect(() => {
    liquity
      .getPrice()
      .then(e => e.toString())
      .then(setBtcPrice);

    liquity.getFees().then(setFees);
  }, [liquity]);

  useEffect(() => {
    if (account && liquity) {
      liquity.getTrove(account).then(setTrove);
      liquity
        .getCollateralSurplusBalance(account)
        .then(setCollateralSurplusBalance);
    }
  }, [account, liquity]);

  useEffect(() => {
    if (liquity) {
      liquity.getPrice().then(setPrice);
    }
  }, [account, liquity]);

  useEffect(() => {
    const getZUSDBalance = async () => {
      const balance = (await liquity.getZUSDBalance(account)).toString();
      return balance;
    };

    if (account && liquity) {
      getZUSDBalance().then(setZusdBalance);
    }
  }, [account, liquity]);

  const cRatio = useMemo(() => {
    return formatValue(
      Number(
        trove
          ?.collateralRatio(price || 0)
          .mul(100)
          .toString(),
      ),
      2,
    );
  }, [price, trove]);

  const showWelcomeBanner =
    !account ||
    (Number(collateralSurplusBalance?.toString()) === 0 &&
      Number(trove?.collateral?.toString()) === 0);

  return (
    <div className="container max-w-7xl mt-24">
      {showWelcomeBanner && <DashboardWelcomeBanner />}

      {!showWelcomeBanner && (
        <LOCStatus
          className="mb-6"
          collateral={formatValue(Number(trove?.collateral?.toString()), 4)}
          debt={formatValue(Number(trove?.debt?.toString()), 2)}
          debtSymbol={SupportedTokens.zusd.toUpperCase()}
          cRatio={cRatio}
          onClose={toggleClosePopup}
          onAdjust={toggleOpenAdjust}
          withdrawalSurplus={Number(collateralSurplusBalance?.toString())}
          onWithdraw={claimCollateralSurplus}
        />
      )}

      <div className="flex-col lg:flex-row flex items-stretch bg-gray-90 p-6 rounded gap-20">
        <div className="min-w-[23rem]">
          <SystemStats />
        </div>
        <div className="flex-1 flex flex-col">
          <Paragraph
            size={ParagraphSize.base}
            style={ParagraphStyle.normal}
            className="mb-6"
          >
            {t(translations.chart.systemLinesCredit)}
          </Paragraph>
          <div className="bg-gray-80 rounded flex-1 pt-2 px-2 flex items-center">
            <LOCChart />
          </div>
        </div>
      </div>

      <Dialog width={DialogSize.sm} isOpen={openAdjust} disableFocusTrap>
        <DialogHeader title="Adjust" onClose={toggleOpenAdjust} />
        <DialogBody>
          <AdjustCreditLine
            collateralValue={trove?.collateral.toString() ?? '0'}
            creditValue={trove?.debt.toString() ?? '0'}
            onSubmit={noop}
            rbtcPrice={btcPrice}
            fees={fees}
          />
        </DialogBody>
      </Dialog>

      <Dialog width={DialogSize.sm} isOpen={openClosePopup} disableFocusTrap>
        <DialogHeader title="Close" onClose={toggleClosePopup} />
        <DialogBody>
          <CloseCreditLine
            onSubmit={closeLOC}
            creditValue={trove?.debt.toString() ?? '0'}
            collateralValue={trove?.collateral.toString() ?? '0'}
            availableBalance={zusdBalance}
          />
        </DialogBody>
      </Dialog>
      <TransactionStepDialog />
    </div>
  );
};
