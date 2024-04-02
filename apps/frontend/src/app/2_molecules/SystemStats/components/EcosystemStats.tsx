import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import {
  applyDataAttr,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { translations } from '../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../utils/asset';
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
  const babelFishMassetManager = useLoadContract(
    'babelfishAggregator',
    'protocol',
  );
  const myntMassetManager = useLoadContract('massetManager', 'protocol');

  const { balance: babelFishDLLRBalance } = useAssetBalance(
    COMMON_SYMBOLS.DLLR,
    RSK_CHAIN_ID,
    babelFishMassetManager?.address.toLowerCase() || '',
  );

  const renderBabelFishDLLRBalance = useMemo(
    () =>
      babelFishDLLRBalance ? (
        <>
          <AmountRenderer
            value={babelFishDLLRBalance}
            suffix={findAsset(COMMON_SYMBOLS.DLLR, RSK_CHAIN_ID)?.symbol}
            precision={USD_DISPLAY_PRECISION}
            showRoundingPrefix={false}
            dataAttribute="ecosystem-statistics-babel-fish-dllr-balance"
          />
        </>
      ) : (
        0
      ),
    [babelFishDLLRBalance],
  );

  const { balance: myntZUSDBalance } = useAssetBalance(
    COMMON_SYMBOLS.ZUSD,
    RSK_CHAIN_ID,
    myntMassetManager?.address.toLowerCase() || '',
  );

  const renderMyntZUSDBalance = useMemo(
    () =>
      myntZUSDBalance ? (
        <AmountRenderer
          value={myntZUSDBalance}
          suffix={findAsset(COMMON_SYMBOLS.ZUSD, RSK_CHAIN_ID)?.symbol}
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
    COMMON_SYMBOLS.DOC,
    RSK_CHAIN_ID,
    myntMassetManager?.address.toLowerCase() || '',
  );

  const renderMyntDOCBalance = useMemo(
    () =>
      myntDOCBalance ? (
        <AmountRenderer
          value={myntDOCBalance}
          suffix={findAsset(COMMON_SYMBOLS.DOC, RSK_CHAIN_ID)?.symbol}
          precision={USD_DISPLAY_PRECISION}
          showRoundingPrefix={false}
          dataAttribute="ecosystem-statistics-mynt-doc-balance"
        />
      ) : (
        0
      ),
    [myntDOCBalance],
  );

  const { value: totalDLLRSupply } = useGetTotalSupply(COMMON_SYMBOLS.DLLR);

  const renderTotalDLLRSupply = useMemo(
    () =>
      totalDLLRSupply ? (
        <AmountRenderer
          value={totalDLLRSupply}
          suffix={findAsset(COMMON_SYMBOLS.DLLR, RSK_CHAIN_ID)?.symbol}
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
