import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { useLoaderData } from 'react-router-dom';

import { Decimal, Percent } from '@sovryn-zero/lib-base';
import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';
import { SupportedTokens } from '@sovryn/contracts';
import {
  applyDataAttr,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import {
  TOKEN_RENDER_PRECISION,
  BTC_RENDER_PRECISION,
} from '../../../3_organisms/ZeroLocForm/constants';
import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { translations } from '../../../../locales/i18n';
import { Bitcoin } from '../../../../utils/constants';
import {
  decimalToBn,
  formatCompactValue,
  formatValue,
  ZERO,
} from '../../../../utils/math';
import { AmountRenderer } from '../../AmountRenderer/AmountRenderer';
import { SystemModeType } from '../types';
import { calculateCollateralRatio } from '../utils';
import { BigNumber } from 'ethers';

type ZeroStatsProps = {
  className?: string;
  dataAttribute?: string;
};

export const ZeroStats: FC<ZeroStatsProps> = ({ className, dataAttribute }) => {
  const { value: blockNumber } = useBlockNumber();
  const [lineOfCredit, setLineOfCredit] = useState('0');
  const [zusdInStabilityPool, setZusdInStabilityPool] = useState<BigNumber>();
  const [zusdSupply, setZusdSupply] = useState<BigNumber>();
  const [rbtcInLoc, setRbtcInLoc] = useState<BigNumber>(ZERO);
  const [zeroPrice, setZeroPrice] = useState<Decimal>();
  const [collateralRatio, setCollateralRatio] = useState('0');
  const [zeroInStabilityPoolPercent, setZeroInStabilityPoolPercent] =
    useState('0');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  const renderRBTCInLoc = useMemo(
    () =>
      rbtcInLoc && zeroPrice ? (
        <>
          <AmountRenderer
            value={rbtcInLoc}
            suffix={Bitcoin}
            precision={BTC_RENDER_PRECISION}
            showRoundingPrefix={false}
            dataAttribute="zero-statistics-rbtc-in-loc"
          />{' '}
          (${formatCompactValue(Number(rbtcInLoc) * Number(zeroPrice), 2)})
        </>
      ) : (
        0
      ),
    [zeroPrice, rbtcInLoc],
  );

  const renderZusdSupply = useMemo(
    () =>
      zusdSupply ? (
        <AmountRenderer
          value={zusdSupply}
          suffix={SupportedTokens.zusd}
          precision={TOKEN_RENDER_PRECISION}
          showRoundingPrefix={false}
          dataAttribute="zero-statistics-zusd-supply"
        />
      ) : (
        0
      ),
    [zusdSupply],
  );

  const renderZusdStabilityPool = useMemo(
    () =>
      zusdInStabilityPool ? (
        <>
          <AmountRenderer
            value={zusdInStabilityPool}
            suffix={SupportedTokens.zusd}
            precision={TOKEN_RENDER_PRECISION}
            showRoundingPrefix={false}
            dataAttribute="zero-statistics-zusd-in-stability-pool"
          />{' '}
          (${zeroInStabilityPoolPercent})
        </>
      ) : (
        0
      ),
    [zusdInStabilityPool, zeroInStabilityPoolPercent],
  );

  const renderProtocolMode = useMemo(
    () => (isRecoveryMode ? SystemModeType.RECOVERY : SystemModeType.NORMAL),
    [isRecoveryMode],
  );

  useEffect(() => {
    liquity
      .getZUSDInStabilityPool()
      .then(result => setZusdInStabilityPool(decimalToBn(result)));
    liquity.getPrice().then(result => setZeroPrice(result));
    liquity
      .getNumberOfTroves()
      .then(result => setLineOfCredit(result.toString()));
  }, [liquity, blockNumber]);

  useEffect(() => {
    liquity.getTotal().then(result => {
      setZusdSupply(decimalToBn(result.debt));
      setRbtcInLoc(decimalToBn(result.collateral));
      if (zeroPrice) {
        const recoveryMode = result.collateralRatioIsBelowCritical(zeroPrice);
        setIsRecoveryMode(recoveryMode);
        setCollateralRatio(
          calculateCollateralRatio(
            result.collateral.toString(),
            result.debt.toString(),
            zeroPrice.toString(),
          ).toString(),
        );
      }
      if (zusdInStabilityPool) {
        const percent = new Percent(
          zusdInStabilityPool.div(decimalToBn(result.debt)),
        );
        setZeroInStabilityPoolPercent(percent?.toString(2));
      }
    });
  }, [liquity, zeroPrice, zusdInStabilityPool, blockNumber]);

  return (
    <div className={className} {...applyDataAttr(dataAttribute)}>
      <Paragraph
        size={ParagraphSize.base}
        style={ParagraphStyle.normal}
        className="mb-3 md:mb-6"
      >
        {t(translations.stats.zero.title)}
      </Paragraph>
      <SimpleTable
        dataAttribute="zero-statistics-table"
        className="lg:max-w-[23.125rem]"
      >
        <SimpleTableRow
          className="mb-5"
          label={t(translations.stats.zero.rbtcInLoc)}
          value={renderRBTCInLoc}
        />
        <SimpleTableRow
          className="mb-5"
          label={t(translations.stats.zero.loc)}
          value={lineOfCredit}
        />
        <SimpleTableRow
          className="mb-5"
          label={t(translations.stats.zero.zusdSupply)}
          value={renderZusdSupply}
        />
        <SimpleTableRow
          className="mb-5"
          label={t(translations.stats.zero.zusdInStabilityPool)}
          value={renderZusdStabilityPool}
        />
        <SimpleTableRow
          className="mb-5"
          label={t(translations.stats.zero.totalCollateralRatio)}
          value={`${formatValue(collateralRatio, 2)}%`}
        />
        <SimpleTableRow
          label={t(translations.stats.zero.protocolStatus)}
          value={renderProtocolMode}
        />
      </SimpleTable>
    </div>
  );
};
