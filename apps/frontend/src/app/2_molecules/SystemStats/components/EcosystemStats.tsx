import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  applyDataAttr,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';
import { fromWei, fromWeiFixed } from '../../../../utils/math';
import { AmountRenderer } from '../../AmountRenderer/AmountRenderer';
import { useGetAssetBalance } from '../hooks/useGetAssetBalance';
import { useGetTotalSupply } from '../hooks/useGetTotalSupply';
import { TokenType } from '../types';

type EcosystemStatsProps = {
  className?: string;
  dataAttribute?: string;
};

const USD_DISPLAY_PRECISION = 2;

export const EcosystemStats: FC<EcosystemStatsProps> = ({
  className,
  dataAttribute,
}) => {
  const { value: babelFishZUSDBalance } = useGetAssetBalance(
    SupportedTokens.zusd,
    TokenType.babelfish,
  );

  const renderBabelFishZUSDBalance = useMemo(
    () =>
      babelFishZUSDBalance ? (
        <>
          <AmountRenderer
            value={fromWeiFixed(babelFishZUSDBalance)}
            suffix={SupportedTokens.zusd}
            precision={USD_DISPLAY_PRECISION}
            showRoundingPrefix={false}
            dataAttribute="ecosystem-statistics-babel-fish-zusd-balance"
          />
        </>
      ) : (
        0
      ),
    [babelFishZUSDBalance],
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
          precision={USD_DISPLAY_PRECISION}
          showRoundingPrefix={false}
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
          precision={USD_DISPLAY_PRECISION}
          showRoundingPrefix={false}
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
          precision={USD_DISPLAY_PRECISION}
          showRoundingPrefix={false}
          dataAttribute="ecosystem-statistics-total-dllr-supply"
        />
      ) : (
        0
      ),
    [totalDLLRSupply],
  );

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
          label={t(translations.stats.ecosystem.babelFishZUSDBalance)}
          value={renderBabelFishZUSDBalance}
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
