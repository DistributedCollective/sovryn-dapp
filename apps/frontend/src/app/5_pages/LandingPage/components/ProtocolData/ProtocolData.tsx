import React, { FC, useCallback, useMemo, useReducer } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Accordion, Button, ButtonStyle } from '@sovryn/ui';

import { BOB_CHAIN_ID, RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  USD,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { USD_VALUE_PRECISION } from './ProtocolData.constants';
import styles from './ProtocolData.module.css';
import { useGetBOBVolume } from './hooks/useGetBOBVolume';
import { useGetLockedData } from './hooks/useGetLockedData';
import { useGetRSKVolume } from './hooks/useGetRSKVolume';
import { useGetTokens } from './hooks/useGetTokens';

const pageTranslations = translations.landingPage.protocolDataSection;

/** Reject non-finite or absurd USD values; return "0" if invalid. */
const sanitizeUsd = (raw: unknown, cap = 1e12) => {
  const n = Number(raw ?? 0);
  if (!isFinite(n) || n < 0 || n > cap) return '0';
  return String(n);
};

/** Pick a reasonable BTC/USD from token lists; validate rough range. */
function pickBtcUsd(
  tokens: Array<{ symbol?: string; usdPrice?: string | number }> = [],
  symbols: string[],
): number | undefined {
  for (const s of symbols) {
    const tok = tokens.find(
      t =>
        t?.symbol?.toUpperCase() === s.toUpperCase() && Number(t.usdPrice) > 0,
    );
    const px = Number(tok?.usdPrice);
    if (isFinite(px) && px >= 1_000 && px <= 200_000) return px; // wide but sane
  }
  return undefined;
}

export const ProtocolData: FC = () => {
  // --- Raw data hooks ---------------------------------------------------------
  // RSK data (TVL parts + 24h volume)
  const rskLocked = useGetLockedData(RSK_CHAIN_ID);
  console.log(rskLocked);

  const rskVolumeRaw = useGetRSKVolume(); // 24h USD (string)

  // BOB data (TVL aggregate + 24h volume)
  const bobLocked = useGetLockedData(BOB_CHAIN_ID);
  console.log('bob locked', bobLocked);

  const bobVolumeRaw = useGetBOBVolume(); // 24h USD (string)

  // Tokens for BTC price sourcing
  const { value: rskTokens } = useGetTokens(RSK_CHAIN_ID);
  const { value: bobTokens } = useGetTokens(BOB_CHAIN_ID);

  const navigate = useNavigate();
  const [open, toggle] = useReducer(v => !v, false);
  const handleClick = useCallback(() => navigate('/stats'), [navigate]);

  // --- BTC/USD sources --------------------------------------------------------
  // Prefer RSK RBTC/WRBTC for stability; fallback to BOB BTC wrappers.
  const rskBtcUsd = useMemo(
    () => pickBtcUsd(rskTokens, ['RBTC', 'WRBTC', 'BTC']) ?? 0,
    [rskTokens],
  );
  const bobBtcUsd = useMemo(
    () =>
      pickBtcUsd(bobTokens, [
        'WBTC',
        'tBTC',
        'UniBTC',
        'XSOLVBTC',
        'SolvBTC',
        'BTC',
      ]) ?? 0,
    [bobTokens],
  );

  // Use ONE global BTC/USD for totals (avoid double-scaling differences).
  const globalBtcUsd = useMemo(
    () => rskBtcUsd || bobBtcUsd || 0,
    [rskBtcUsd, bobBtcUsd],
  );

  // --- RSK TVL (USD) aggregated from sub-buckets ------------------------------
  const rskTvlUsd = useMemo(
    () =>
      decimalic(rskLocked?.tvlAmm?.totalUsd || 0)
        .add(rskLocked?.tvlLending?.totalUsd || 0)
        .add(rskLocked?.tvlMynt?.totalUsd || 0)
        .add(rskLocked?.tvlProtocol?.totalUsd || 0)
        .add(rskLocked?.tvlStaking?.totalUsd || 0)
        .add(rskLocked?.tvlSubprotocols?.totalUsd || 0)
        .add(rskLocked?.tvlZero?.totalUsd || 0)
        .toString(),
    [rskLocked],
  );

  // --- BOB TVL (USD) from backend (already recomputed/clamped in hook) -------
  const bobTvlUsd = useMemo(() => {
    // accept either total_usd or totalUsd from the hook
    const raw = bobLocked.total_usd;
    return sanitizeUsd(raw, 1e12);
  }, [bobLocked]);

  // --- Per-chain TVL in BTC ---------------------------------------------------
  const rskTvlBtc = useMemo(
    () => (rskBtcUsd ? decimalic(rskTvlUsd).div(rskBtcUsd).toString() : '0'),
    [rskTvlUsd, rskBtcUsd],
  );
  const bobTvlBtc = useMemo(
    () => (bobBtcUsd ? decimalic(bobTvlUsd).div(bobBtcUsd).toString() : '0'),
    [bobTvlUsd, bobBtcUsd],
  );

  // --- 24h volumes (USD sanitized) -------------------------------------------
  const rskVolumeUsd = useMemo(
    () => sanitizeUsd(rskVolumeRaw, 1e12),
    [rskVolumeRaw],
  );
  const bobVolumeUsd = useMemo(
    () => sanitizeUsd(bobVolumeRaw, 1e12),
    [bobVolumeRaw],
  );

  // --- Per-chain 24h volume in BTC -------------------------------------------
  const rskVolumeBtc = useMemo(
    () => (rskBtcUsd ? decimalic(rskVolumeUsd).div(rskBtcUsd).toString() : '0'),
    [rskVolumeUsd, rskBtcUsd],
  );
  const bobVolumeBtc = useMemo(
    () => (bobBtcUsd ? decimalic(bobVolumeUsd).div(bobBtcUsd).toString() : '0'),
    [bobVolumeUsd, bobBtcUsd],
  );

  // --- Totals (USD) and convert once with global BTC/USD ----------------------
  const totalTvlUsd = useMemo(
    () => decimalic(rskTvlUsd).add(bobTvlUsd).toString(),
    [rskTvlUsd, bobTvlUsd],
  );
  const totalVolUsd = useMemo(
    () => decimalic(rskVolumeUsd).add(bobVolumeUsd).toString(),
    [rskVolumeUsd, bobVolumeUsd],
  );

  const totalTvlBtc = useMemo(
    () =>
      globalBtcUsd ? decimalic(totalTvlUsd).div(globalBtcUsd).toString() : '0',
    [totalTvlUsd, globalBtcUsd],
  );
  const totalVolBtc = useMemo(
    () =>
      globalBtcUsd ? decimalic(totalVolUsd).div(globalBtcUsd).toString() : '0',
    [totalVolUsd, globalBtcUsd],
  );

  // --- Render -----------------------------------------------------------------
  return (
    <div>
      <div className="text-base font-medium text-gray-10">
        <div className="sm:justify-start justify-between flex items-baseline">
          {t(pageTranslations.title)}
          <Button
            text={t(pageTranslations.cta)}
            style={ButtonStyle.ghost}
            onClick={handleClick}
            dataAttribute="protocol-data-view-button"
            className="ml-3"
          />
        </div>
      </div>

      <Accordion
        label={
          <div className="flex justify-between font-medium w-full">
            {/* TOTAL TVL (All Networks) — BTC + USD (one BTC/USD) */}
            <div className="flex flex-col items-start sm:min-w-44">
              <div className="text-xs text-gray-30 mb-2">
                {t(pageTranslations.totalValueLockedAllNetworks)}
              </div>

              {/* BTC total */}
              <div className="sm:text-xl text-gray-10 text-sm sm:font-medium font-semibold leading-8">
                <AmountRenderer
                  value={totalTvlBtc}
                  suffix={BITCOIN}
                  precision={BTC_RENDER_PRECISION}
                />
              </div>

              {/* USD total */}
              <div className="text-gray-50 text-sm">
                <AmountRenderer
                  value={totalTvlUsd}
                  suffix={USD}
                  precision={USD_VALUE_PRECISION}
                />
              </div>
            </div>

            {/* TOTAL 24H VOLUME (All Networks) — BTC + USD (one BTC/USD) */}
            <div className="ml-10 mr-5 flex flex-col items-start sm:min-w-44">
              <div className="text-xs text-gray-30 mb-2">
                {t(pageTranslations.volumeAllNetworks)}
              </div>

              {/* 24h volume in BTC */}
              <div className="sm:text-xl text-gray-10 text-sm sm:font-medium font-semibold leading-8">
                <AmountRenderer
                  value={totalVolBtc}
                  suffix={BITCOIN}
                  precision={BTC_RENDER_PRECISION}
                />
              </div>

              {/* 24h volume in USD */}
              <div className="text-gray-50 text-sm">
                <AmountRenderer
                  value={totalVolUsd}
                  suffix={USD}
                  precision={USD_VALUE_PRECISION}
                />
              </div>
            </div>
          </div>
        }
        children={
          <div className="lg:p-4 px-0 py-4 font-medium">
            {/* RSK ROW */}
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-start sm:min-w-44">
                <div className="text-xs text-gray-30 mb-2">
                  {t(pageTranslations.tvlRskNetwork)}
                </div>

                {/* TVL (RSK) in BTC */}
                <div className="text-gray-10 text-sm sm:font-medium font-semibold">
                  <AmountRenderer
                    value={rskTvlBtc}
                    suffix={BITCOIN}
                    precision={BTC_RENDER_PRECISION}
                  />
                </div>

                {/* TVL (RSK) in USD */}
                <div className="text-gray-50 text-sm">
                  <AmountRenderer
                    value={rskTvlUsd}
                    suffix={USD}
                    precision={USD_VALUE_PRECISION}
                  />
                </div>
              </div>

              <div className="ml-10 mr-5 flex flex-col sm:min-w-44">
                <div className="text-xs text-gray-30 mb-2">
                  {t(pageTranslations.volumeRskNetwork)}
                </div>

                {/* 24h Volume (RSK) in BTC */}
                <div className="text-gray-10 text-sm sm:font-medium font-semibold">
                  <AmountRenderer
                    value={rskVolumeBtc}
                    suffix={BITCOIN}
                    precision={BTC_RENDER_PRECISION}
                  />
                </div>

                {/* 24h Volume (RSK) in USD */}
                <div className="text-gray-50 text-sm">
                  <AmountRenderer
                    value={rskVolumeUsd}
                    suffix={USD}
                    precision={USD_VALUE_PRECISION}
                  />
                </div>
              </div>
            </div>

            {/* BOB ROW */}
            <div className="flex justify-between w-full mt-4">
              <div className="flex flex-col sm:min-w-44">
                <div className="text-xs text-gray-30 mb-2">
                  {t(pageTranslations.tvlBobNetwork)}
                </div>

                {/* TVL (BOB) in BTC */}
                <div className="text-gray-10 text-sm sm:font-medium font-semibold">
                  <AmountRenderer
                    value={bobTvlBtc}
                    suffix={BITCOIN}
                    precision={BTC_RENDER_PRECISION}
                  />
                </div>

                {/* TVL (BOB) in USD */}
                <div className="text-gray-50 text-sm">
                  <AmountRenderer
                    value={bobTvlUsd}
                    suffix={USD}
                    precision={USD_VALUE_PRECISION}
                  />
                </div>
              </div>

              <div className="ml-10 mr-5 flex flex-col items-start sm:min-w-44">
                <div className="text-xs text-gray-30 mb-2">
                  {t(pageTranslations.volumeBobNetwork)}
                </div>

                {/* 24h Volume (BOB) in BTC */}
                <div className="text-gray-10 text-sm sm:font-medium font-semibold">
                  <AmountRenderer
                    value={bobVolumeBtc}
                    suffix={BITCOIN}
                    precision={BTC_RENDER_PRECISION}
                  />
                </div>

                {/* 24h Volume (BOB) in USD */}
                <div className="text-gray-50 text-sm">
                  <AmountRenderer
                    value={bobVolumeUsd}
                    suffix={USD}
                    precision={USD_VALUE_PRECISION}
                  />
                </div>
              </div>
            </div>
          </div>
        }
        dataAttribute="protocol-data-accordion"
        open={open}
        onClick={toggle}
        className={styles.accordion}
      />
    </div>
  );
};
