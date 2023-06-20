import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';

import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';
import {
  ErrorBadge,
  ErrorLevel,
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
  HeadingType,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
} from '../../3_organisms/ZeroLocForm/constants';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  SOV,
} from '../../../constants/currencies';
import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { useGetOpenTrove } from '../../../hooks/zero/useGetOpenTrove';
import { useGetRBTCPrice } from '../../../hooks/zero/useGetRBTCPrice';
import { useGetTroves } from '../../../hooks/zero/useGetTroves';
import { translations } from '../../../locales/i18n';
import { calculateCollateralRatio } from '../../../utils/helpers';
import { decimalic } from '../../../utils/math';
import { useGetSovGain } from './hooks/useGetSovGain';
import { useHandleRewards } from './hooks/useHandleRewards';
import { RewardsAction } from './types';

const RewardsPage: FC = () => {
  const { account, signer } = useAccount();
  const [amount, setAmount] = useState<Decimal>(Decimal.ZERO);
  const isOpenTroveExists = useGetOpenTrove();
  const { value: block } = useBlockNumber();
  const [isUnderCollateralized, setIsUnderCollateralized] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const { price } = useGetRBTCPrice();

  const {
    data: troves,
    loading: loadingTroves,
    refetch: refetchTroves,
  } = useGetTroves();

  const { checkMaintenance, States } = useMaintenance();
  const claimLocked = checkMaintenance(States.ZERO_STABILITY_CLAIM);
  const { sovGain, updateSOVGain } = useGetSovGain();

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  const handleWithdraw = useHandleRewards(
    RewardsAction.withdrawFromSP,
    amount.toString(),
    updateSOVGain,
  );

  const handleTransferToLOC = useHandleRewards(
    RewardsAction.withdrawETHGainToTrove,
    amount.toString(),
    updateSOVGain,
  );

  useEffect(() => {
    if (!account) {
      return;
    }

    liquity.getTotal().then(result => {
      if (price) {
        const recoveryMode = result.collateralRatioIsBelowCritical(price);
        setIsRecoveryMode(recoveryMode);
      }
    });

    liquity
      .getStabilityDeposit(account)
      .then(result => setAmount(decimalic(result.collateralGain.toString())));
  }, [liquity, account, block, price]);

  const claimDisabled = useMemo(
    () =>
      (amount.isZero() && Decimal.from(sovGain).isZero()) ||
      !signer ||
      claimLocked ||
      loadingTroves ||
      isUnderCollateralized,
    [
      amount,
      claimLocked,
      signer,
      sovGain,
      isUnderCollateralized,
      loadingTroves,
    ],
  );

  useEffect(() => {
    refetchTroves();
  }, [refetchTroves, block]);

  useEffect(() => {
    if (claimLocked) {
      setIsUnderCollateralized(false);
      return;
    }

    if (troves?.troves) {
      const isLowTroveExists = troves.troves.reduce(
        (acc, { collateral, debt }) => {
          const collateralRatio = calculateCollateralRatio(
            decimalic(collateral),
            decimalic(debt),
            decimalic(price),
          );

          const isRatioBelowThreshold = isRecoveryMode
            ? collateralRatio.lt(CRITICAL_COLLATERAL_RATIO.mul(100))
            : collateralRatio.lt(MINIMUM_COLLATERAL_RATIO.mul(100));

          return acc || isRatioBelowThreshold;
        },
        false,
      );

      setIsUnderCollateralized(isLowTroveExists);
    }
  }, [troves, claimLocked, price, isRecoveryMode]);

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
      </Helmet>
      <div className="flex flex-col items-center mt-6 sm:mt-28 w-full">
        <Heading className="font-medium mb-4" type={HeadingType.h1}>
          {t(translations.rewardPage.title)}
        </Heading>
        <Paragraph
          style={ParagraphStyle.tall}
          className="font-medium mb-[3.25rem]"
          size={ParagraphSize.base}
        >
          {t(translations.rewardPage.subtitle)}
        </Paragraph>

        <div className="border border-gray-50 rounded w-full sm:w-[25rem] p-3 bg-gray-90">
          <div className="bg-gray-70 rounded p-6 text-center mb-6">
            <Paragraph
              className="font-medium mb-2 text-gray-10"
              size={ParagraphSize.small}
            >
              {t(translations.rewardPage.stabilityPoolRewards)}
            </Paragraph>
            <div className="text-2xl leading-7 uppercase">
              <AmountRenderer
                value={amount}
                suffix={BITCOIN}
                precision={BTC_RENDER_PRECISION}
                dataAttribute="rewards-amount"
              />
            </div>

            <div className="text-center mt-4">
              <Paragraph
                className="font-medium mb-2 text-gray-10"
                size={ParagraphSize.small}
              >
                {t(translations.rewardPage.stabilityPoolSubsidies)}
              </Paragraph>
              <div className="text-2xl leading-7 uppercase">
                <AmountRenderer
                  value={sovGain}
                  suffix={SOV}
                  precision={BTC_RENDER_PRECISION}
                  dataAttribute="rewards-amount"
                />
              </div>
            </div>
          </div>

          {isUnderCollateralized && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={t(translations.rewardPage.undercollateralized)}
              className="mb-6"
            />
          )}

          <div className="flex flex-row justify-center gap-3">
            <Button
              type={ButtonType.button}
              style={ButtonStyle.secondary}
              text={t(translations.rewardPage.actions.withdraw)}
              className="w-full max-w-48"
              onClick={handleWithdraw}
              disabled={claimDisabled}
              dataAttribute="rewards-withdraw"
            />
            {isOpenTroveExists && Number(amount) > 0 && signer && (
              <Button
                type={ButtonType.button}
                style={ButtonStyle.secondary}
                text={t(translations.rewardPage.actions.transferToLOC)}
                className="w-full"
                onClick={handleTransferToLOC}
                disabled={claimLocked}
                dataAttribute="rewards-transfer-to-loc"
              />
            )}
          </div>

          {claimLocked && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.featureDisabled)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RewardsPage;
