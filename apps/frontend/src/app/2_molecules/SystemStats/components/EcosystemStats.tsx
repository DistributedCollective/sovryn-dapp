import { Decimal } from '@sovryn-zero/lib-base';
import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';

import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
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
import { Bitcoin } from '../../../../utils/constants';
import {
  formatCompactValue,
  formatValue,
  fromWeiFixed,
} from '../../../../utils/math';
import { useGetAssetBalance } from '../hooks/useGetAssetBalance';
import { useGetTotalSupply } from '../hooks/useGetTotalSupply';
import { TokenType } from '../types';

type EcosystemStatsProps = {
  className?: string;
  dataAttribute?: string;
};

export const EcosystemStats: FC<EcosystemStatsProps> = ({
  className,
  dataAttribute,
}) => {
  const [zeroPrice, setZeroPrice] = useState<Decimal>();
  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  const { value: babelFishZUSDBalance } = useGetAssetBalance(
    SupportedTokens.zusd,
    TokenType.babelfish,
  );

  const renderBabelFishZUSDBalance = useMemo(
    () =>
      babelFishZUSDBalance && zeroPrice
        ? `${formatValue(
            Number(fromWeiFixed(babelFishZUSDBalance)),
            0,
          )} ${Bitcoin} ($${formatCompactValue(
            Number(fromWeiFixed(babelFishZUSDBalance)) * Number(zeroPrice),
            2,
          )})`
        : 0,
    [zeroPrice, babelFishZUSDBalance],
  );

  const { value: babelFishDLLRBalance } = useGetAssetBalance(
    SupportedTokens.dllr,
    TokenType.babelfish,
  );

  const renderBabelFishDLLRBalance = useMemo(
    () =>
      babelFishDLLRBalance
        ? `${formatValue(
            Number(fromWeiFixed(babelFishDLLRBalance)),
            2,
          )} ${SupportedTokens.dllr.toUpperCase()}`
        : 0,
    [babelFishDLLRBalance],
  );

  const { value: myntZUSDBalance } = useGetAssetBalance(
    SupportedTokens.zusd,
    TokenType.mynt,
  );

  const renderMyntZUSDBalance = useMemo(
    () =>
      myntZUSDBalance
        ? `${formatValue(
            Number(fromWeiFixed(myntZUSDBalance)),
            2,
          )} ${SupportedTokens.zusd.toUpperCase()}`
        : 0,
    [myntZUSDBalance],
  );

  const { value: myntDOCBalance } = useGetAssetBalance(
    SupportedTokens.doc,
    TokenType.mynt,
  );

  const renderMyntDOCBalance = useMemo(
    () =>
      myntDOCBalance
        ? `${formatValue(
            Number(fromWeiFixed(myntDOCBalance)),
            2,
          )} ${SupportedTokens.doc.toUpperCase()}`
        : 0,
    [myntDOCBalance],
  );

  const { value: totalDLLRSupply } = useGetTotalSupply(SupportedTokens.dllr);

  const renderTotalDLLRSupply = useMemo(
    () =>
      totalDLLRSupply
        ? `${formatValue(
            Number(fromWeiFixed(totalDLLRSupply)),
            2,
          )} ${SupportedTokens.dllr.toUpperCase()}`
        : 0,
    [totalDLLRSupply],
  );

  useEffect(() => {
    liquity.getPrice().then(result => setZeroPrice(result));
  }, [liquity]);

  return (
    <div className={className} {...applyDataAttr(dataAttribute)}>
      <Paragraph
        size={ParagraphSize.base}
        style={ParagraphStyle.normal}
        className="mb-3 md:mb-6"
      >
        {t(translations.stats.ecosystem.title)}
      </Paragraph>
      <SimpleTable
        dataAttribute="system-statistics"
        className="lg:max-w-[23.125rem]"
      >
        <SimpleTableRow
          className="mb-8"
          label={
            <div className="flex items-center">
              {t(translations.stats.ecosystem.babelFishZUSDBalance)}
              <Tooltip
                className="ml-2"
                content={t(translations.stats.ecosystem.babelFishZUSDBalance)}
                dataAttribute="system-statistics-tooltip-rbtc-in-loc"
              >
                <div>
                  <Icon size={12} icon="info" />
                </div>
              </Tooltip>
            </div>
          }
          value={renderBabelFishZUSDBalance}
        />
        <SimpleTableRow
          className="mb-8"
          label={t(translations.stats.ecosystem.babelFishDLLRBalance)}
          value={renderBabelFishDLLRBalance}
        />
        <SimpleTableRow
          className="mb-8"
          label={t(translations.stats.ecosystem.myntZUSDBalance)}
          value={renderMyntZUSDBalance}
        />
        <SimpleTableRow
          className="mb-8"
          label={t(translations.stats.ecosystem.myntDOCBalance)}
          value={renderMyntDOCBalance}
        />
        <SimpleTableRow
          label={t(translations.stats.ecosystem.totalDLLRSupply)}
          value={renderTotalDLLRSupply}
        />
      </SimpleTable>
    </div>
  );
};
