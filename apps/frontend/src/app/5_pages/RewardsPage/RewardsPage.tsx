import { Decimal } from '@sovryn-zero/lib-base';
import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';

import React, { FC, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { applyDataAttr } from '@sovryn/ui';
import {
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
  HeadingType,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';

import { TransactionStepDialog } from '../../3_organisms';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import styles from './RewardsPage.module.css';
import { useGetOpenTrove } from './hooks/useGetOpenTrove';
import { useHandleRewards } from './hooks/useHandleRewards';
import { RewardsAction } from './types';

const RewardsPage: FC = () => {
  const { t } = useTranslation();
  const { account, signer } = useAccount();
  const [amount, setAmount] = useState<Decimal>(Decimal.from(0));
  const isOpenTroveExists = useGetOpenTrove();

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
    liquity
      .getStabilityDeposit(account)
      .then(result => setAmount(result.collateralGain));
  }, [liquity, account]);

  return (
    <div className={styles.wrapper}>
      <Heading
        className="font-medium mb-4"
        type={HeadingType.h1}
        {...applyDataAttr('rewards-title')}
      >
        {t(translations.rewardPage.title)}
      </Heading>
      <Paragraph
        style={ParagraphStyle.tall}
        className="font-medium mb-[3.25rem]"
        size={ParagraphSize.base}
        {...applyDataAttr('rewards-subtitle')}
      >
        {t(translations.rewardPage.subtitle)}
      </Paragraph>

      <div className={styles.content}>
        <div className={styles.rewards}>
          <Paragraph
            className="font-medium mb-2"
            size={ParagraphSize.small}
            {...applyDataAttr('rewards-stability-pool-rewards')}
          >
            {t(translations.rewardPage.stabilityPoolRewards)}
          </Paragraph>
          <div className={styles.amount}>
            {amount?.prettify(4)} {t(translations.rewardPage.btc)}
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type={ButtonType.button}
            style={ButtonStyle.secondary}
            text={t(translations.rewardPage.actions.withdraw)}
            className="w-full max-w-48"
            onClick={handleWithdraw}
            disabled={Number(amount) === 0 || !signer}
            {...applyDataAttr('rewards-withdraw')}
          />
          {isOpenTroveExists && Number(amount) > 0 && signer && (
            <Button
              type={ButtonType.button}
              style={ButtonStyle.secondary}
              text={t(translations.rewardPage.actions.transferToLOC)}
              className="w-full"
              onClick={handleTransferToLOC}
              {...applyDataAttr('rewards-transfer-to-loc')}
            />
          )}
        </div>
      </div>
      <TransactionStepDialog />
    </div>
  );
};

export default RewardsPage;
