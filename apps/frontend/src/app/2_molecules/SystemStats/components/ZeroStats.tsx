import { Decimal, Percent } from '@sovryn-zero/lib-base';
import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';

import React, { FC, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { SupportedTokens } from '@sovryn/contracts';
import {
  applyDataAttr,
  Icon,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
  SimpleTable,
  SimpleTableRow,
  Tooltip,
} from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';
import { formatValue } from '../../../../utils/math';
import { SystemModeType } from '../types';
import { calculateCollateralRatio } from '../utils';

type ZeroStatsProps = {
  className?: string;
  dataAttribute?: string;
};

export const ZeroStats: FC<ZeroStatsProps> = ({ className, dataAttribute }) => {
  const { t } = useTranslation();
  const [lineOfCredit, setLineOfCredit] = useState('0');
  const [zusdInStabilityPool, setZusdInStabilityPool] = useState<Decimal>();
  const [zusdSupply, setZusdSupply] = useState<Decimal>();
  const [rbtcInLoc, setRbtcInLoc] = useState('0');
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
      rbtcInLoc && zeroPrice
        ? `${formatValue(
            Number(rbtcInLoc),
            0,
          )} ${SupportedTokens.rbtc.toUpperCase()} ($${formatValue(
            Number(rbtcInLoc) * Number(zeroPrice),
            2,
          )}M)`
        : 0,
    [zeroPrice, rbtcInLoc],
  );

  const renderZusdSupply = useMemo(
    () =>
      zusdSupply
        ? `${formatValue(
            Number(zusdSupply),
            2,
          )} ${SupportedTokens.zusd.toUpperCase()}`
        : 0,
    [zusdSupply],
  );

  const renderZusdStabilityPool = useMemo(
    () =>
      zusdInStabilityPool
        ? `${formatValue(
            Number(zusdInStabilityPool),
            2,
          )} ${SupportedTokens.zusd.toUpperCase()} (${zeroInStabilityPoolPercent})`
        : 0,
    [zusdInStabilityPool, zeroInStabilityPoolPercent],
  );

  const renderProtocolMode = useMemo(
    () => (isRecoveryMode ? SystemModeType.RECOVERY : SystemModeType.NORMAL),
    [isRecoveryMode],
  );

  useEffect(() => {
    liquity
      .getZUSDInStabilityPool()
      .then(result => setZusdInStabilityPool(result));
    liquity.getPrice().then(result => setZeroPrice(result));
    liquity
      .getNumberOfTroves()
      .then(result => setLineOfCredit(result.toString()));
  }, [liquity]);

  useEffect(() => {
    liquity.getTotal().then(result => {
      setZusdSupply(result.debt);
      setRbtcInLoc(result.collateral.toString());
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
        const percent = new Percent(zusdInStabilityPool.div(result.debt));
        setZeroInStabilityPoolPercent(percent?.toString(2));
      }
    });
  }, [liquity, zeroPrice, zusdInStabilityPool]);

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
        dataAttribute="system-statistics"
        className="lg:max-w-[23.125rem]"
      >
        <SimpleTableRow
          className="mb-5"
          label={
            <div className="flex items-center">
              {t(translations.stats.zero.rbtcInLoc)}
              <Tooltip
                className="ml-2"
                content={t(translations.stats.zero.rbtcInLoc)}
                dataAttribute="system-statistics-tooltip-rbtc-in-loc"
              >
                <div>
                  <Icon size={12} icon="info" />
                </div>
              </Tooltip>
            </div>
          }
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
          value={`${collateralRatio}%`}
        />
        <SimpleTableRow
          label={t(translations.stats.zero.protocolStatus)}
          value={renderProtocolMode}
        />
      </SimpleTable>
    </div>
  );
};
