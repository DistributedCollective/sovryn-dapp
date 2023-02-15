import { Decimal } from '@sovryn-zero/lib-base';
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

import {
  ASSET_TRUNCATE_COUNT,
  BTC_TRUNCATE_COUNT,
} from '../../../3_organisms/ZeroLocForm/constants';
import { translations } from '../../../../locales/i18n';
import { Bitcoin } from '../../../../utils/constants';
import {
  formatCompactValue,
  fromWei,
  fromWeiFixed,
} from '../../../../utils/math';
import { AmountRenderer } from '../../AmountRenderer/AmountRenderer';
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
  const { t } = useTranslation();
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
      babelFishZUSDBalance && zeroPrice ? (
        <>
          <AmountRenderer
            value={fromWeiFixed(babelFishZUSDBalance)}
            suffix={Bitcoin}
            precision={BTC_TRUNCATE_COUNT}
            dataAttribute="ecosystem-statistics-babel-fish-zusd-balance"
          />{' '}
          ($
          {formatCompactValue(
            Number(fromWeiFixed(babelFishZUSDBalance)) * Number(zeroPrice),
            2,
          )}
          )
        </>
      ) : (
        0
      ),
    [zeroPrice, babelFishZUSDBalance],
  );

  const { value: babelFishDLLRBalance } = useGetAssetBalance(
    SupportedTokens.dllr,
    TokenType.babelfish,
  );

  const renderBabelFishDLLRBalance = useMemo(
    () =>
      babelFishDLLRBalance ? (
        <AmountRenderer
          value={fromWei(babelFishDLLRBalance)}
          suffix={SupportedTokens.dllr}
          precision={ASSET_TRUNCATE_COUNT}
          dataAttribute="ecosystem-statistics-babel-fish-dllr-balance"
        />
      ) : (
        0
      ),
    [babelFishDLLRBalance],
  );

  const { value: myntZUSDBalance } = useGetAssetBalance(
    SupportedTokens.zusd,
    TokenType.mynt,
  );

  const renderMyntZUSDBalance = useMemo(
    () =>
      myntZUSDBalance ? (
        <AmountRenderer
          value={fromWei(myntZUSDBalance)}
          suffix={SupportedTokens.zusd}
          precision={ASSET_TRUNCATE_COUNT}
          dataAttribute="ecosystem-statistics-mynt-zusd-balance"
        />
      ) : (
        0
      ),
    [myntZUSDBalance],
  );

  const { value: myntDOCBalance } = useGetAssetBalance(
    SupportedTokens.doc,
    TokenType.mynt,
  );

  const renderMyntDOCBalance = useMemo(
    () =>
      myntDOCBalance ? (
        <AmountRenderer
          value={fromWei(myntDOCBalance)}
          suffix={SupportedTokens.doc}
          precision={ASSET_TRUNCATE_COUNT}
          dataAttribute="ecosystem-statistics-mynt-doc-balance"
        />
      ) : (
        0
      ),
    [myntDOCBalance],
  );

  const { value: totalDLLRSupply } = useGetTotalSupply(SupportedTokens.dllr);

  const renderTotalDLLRSupply = useMemo(
    () =>
      totalDLLRSupply ? (
        <AmountRenderer
          value={fromWei(totalDLLRSupply)}
          suffix={SupportedTokens.dllr}
          precision={ASSET_TRUNCATE_COUNT}
          dataAttribute="ecosystem-statistics-total-dllr-supply"
        />
      ) : (
        0
      ),
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
        dataAttribute="ecosystem-statistics-table"
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
                dataAttribute="ecosystem-statistics-tooltip-rbtc-in-loc"
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
