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
import { BTC_RENDER_PRECISION } from '../../3_organisms/ZeroLocForm/constants';
import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { useGetOpenTrove } from '../../../hooks/zero/useGetOpenTrove';
import { translations } from '../../../locales/i18n';
import { Bitcoin } from '../../../utils/constants';
import { decimalic } from '../../../utils/math';
import { useHandleRewards } from './hooks/useHandleRewards';
import { RewardsAction } from './types';

const RewardsPage: FC = () => {
  const { account, signer } = useAccount();
  const [amount, setAmount] = useState<Decimal>(Decimal.ZERO);
  const isOpenTroveExists = useGetOpenTrove();
  const { value: block } = useBlockNumber();

  const { checkMaintenance, States } = useMaintenance();
  const claimLocked = checkMaintenance(States.ZERO_STABILITY_CLAIM);

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  const handleWithdraw = useHandleRewards(
    RewardsAction.withdrawFromSP,
    amount.toString(),
  );

  const handleTransferToLOC = useHandleRewards(
    RewardsAction.withdrawETHGainToTrove,
    amount.toString(),
  );

  useEffect(() => {
    if (!account) {
      return;
    }

    liquity
      .getStabilityDeposit(account)
      .then(result => setAmount(decimalic(result.collateralGain.toString())));
  }, [liquity, account, block]);

  const claimDisabled = useMemo(
    () => amount.isZero() || !signer || claimLocked,
    [amount, claimLocked, signer],
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
      </Helmet>
      <div className="flex flex-col items-center mt-6 sm:mt-28">
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
                suffix={Bitcoin}
                precision={BTC_RENDER_PRECISION}
                dataAttribute="rewards-amount"
              />
            </div>
          </div>

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
