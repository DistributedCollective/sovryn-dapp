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

import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import { AmountRenderer } from '../../AmountRenderer/AmountRenderer';
import { useGetTotalSupply } from '../hooks/useGetTotalSupply';

type EcosystemStatsProps = {
  className?: string;
  dataAttribute?: string;
};

const USD_DISPLAY_PRECISION = 2;

export const EcosystemStats: FC<EcosystemStatsProps> = ({
  className,
  dataAttribute,
}) => {
  const babelFishMassetManager = useLoadContract('babelfish', 'tokens');
  const myntMassetManager = useLoadContract('massetManager', 'protocol');

  const { balance: babelFishZUSDBalance } = useAssetBalance(
    SupportedTokens.zusd,
    getRskChainId(),
    babelFishMassetManager?.address.toLowerCase() || '',
  );

  const renderBabelFishZUSDBalance = useMemo(
    () =>
      babelFishZUSDBalance ? (
        <>
          <AmountRenderer
            value={babelFishZUSDBalance}
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

  const { balance: myntZUSDBalance } = useAssetBalance(
    SupportedTokens.zusd,
    getRskChainId(),
    myntMassetManager?.address.toLowerCase() || '',
  );

  const renderMyntZUSDBalance = useMemo(
    () =>
      myntZUSDBalance ? (
        <AmountRenderer
          value={myntZUSDBalance}
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

  const { balance: myntDOCBalance } = useAssetBalance(
    SupportedTokens.doc,
    getRskChainId(),
    myntMassetManager?.address.toLowerCase() || '',
  );

  const renderMyntDOCBalance = useMemo(
    () =>
      myntDOCBalance ? (
        <AmountRenderer
          value={myntDOCBalance}
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
          value={totalDLLRSupply}
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
