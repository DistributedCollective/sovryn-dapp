import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { useLoaderData } from 'react-router-dom';

import { Percent } from '@sovryn-zero/lib-base';
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
import { Decimal } from '@sovryn/utils';

import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { translations } from '../../../../locales/i18n';
import { Bitcoin } from '../../../../utils/constants';
import { formatCompactValue, formatValue } from '../../../../utils/math';
import { AmountRenderer } from '../../AmountRenderer/AmountRenderer';
import { SystemModeType } from '../types';
import { calculateCollateralRatio } from '../utils';

type ZeroStatsProps = {
  className?: string;
  dataAttribute?: string;
};

const USD_DISPLAY_PRECISION = 2;

export const ZeroStats: FC<ZeroStatsProps> = ({ className, dataAttribute }) => {
  const { value: blockNumber } = useBlockNumber();
  const [lineOfCredit, setLineOfCredit] = useState('0');
  const [zusdInStabilityPool, setZusdInStabilityPool] = useState<Decimal>();
  const [zusdSupply, setZusdSupply] = useState<Decimal>();
  const [rbtcInLoc, setRbtcInLoc] = useState<Decimal>(Decimal.ZERO);
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
            precision={2}
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
          precision={USD_DISPLAY_PRECISION}
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
            precision={USD_DISPLAY_PRECISION}
            showRoundingPrefix={false}
            dataAttribute="zero-statistics-zusd-in-stability-pool"
          />{' '}
          ({zeroInStabilityPoolPercent})
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
      .then(result => setZusdInStabilityPool(Decimal.from(result.toString())));
    liquity
      .getPrice()
      .then(result => setZeroPrice(Decimal.from(result.toString())));
    liquity
      .getNumberOfTroves()
      .then(result => setLineOfCredit(result.toString()));
  }, [liquity, blockNumber]);

  useEffect(() => {
    liquity.getTotal().then(result => {
      setZusdSupply(Decimal.from(result.debt.toString()));
      setRbtcInLoc(Decimal.from(result.collateral.toString()));
      if (zeroPrice) {
        const recoveryMode = result.collateralRatioIsBelowCritical(
          zeroPrice.toString(),
        );
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
          zusdInStabilityPool.div(result.debt.toString()),
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
          label={t(translations.stats.zero.loc)}
          value={lineOfCredit}
        />
        <SimpleTableRow
          className="mb-5"
          label={t(translations.stats.zero.rbtcInLoc)}
          value={renderRBTCInLoc}
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
