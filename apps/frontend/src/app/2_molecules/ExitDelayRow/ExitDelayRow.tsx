import React, { FC } from 'react';

import { t } from 'i18next';
import { Link } from 'react-router-dom';

import { HelperButton, SimpleTableRow, TooltipTrigger } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import {
  formatDelayDuration,
  getExitDelayDisplay,
} from '../../../utils/exitDelay';

export type ExitDelayRowProps = {
  /** Seconds the perimeter will hold this withdrawal; 0 renders nothing. */
  delaySeconds: number;
  /**
   * Whether the quote was obtained at all. Unlike the fee, this cannot be
   * dropped: the chain fails closed on the delay, so an unobtained quote means
   * the withdrawal is held or it reverts, never that it is paid straight out.
   */
  unknown: boolean;
  /**
   * Whether the quote is still on its way. Required: a caller that forgot it
   * would render a quote that has not arrived as a withdrawal paid now.
   */
  loading: boolean;
};

const VaultLink: FC = () => (
  <Link
    to="/perimeter"
    className="text-primary-20 underline hover:no-underline"
    data-test-id="exit-delay-vault-link"
  >
    {t(translations.exitDelay.vaultLink)}
  </Link>
);

/**
 * Tells the holder, before they sign, that this withdrawal will be held rather
 * than paid straight out — for how long, where it goes, and where to release
 * it from. The destination notice is visible in the form itself, not tucked
 * behind the tooltip: a held withdrawal does not arrive, and a user who was
 * only told about a fee would read that as money missing.
 *
 * Silence is reserved for the one case that earns it: a quote that ARRIVED and
 * said nothing is held. A quote still on its way, and a quote we could not
 * obtain, each get a row saying so, because on chain the delay fails closed —
 * the exit is escrowed, or it reverts with `PERIMETER:delay-quote-failed`.
 * Rendering nothing there would state, in the only way a form can, that the
 * money arrives now.
 */
export const ExitDelayRow: FC<ExitDelayRowProps> = ({
  delaySeconds,
  unknown,
  loading,
}) => {
  const display = getExitDelayDisplay({ delaySeconds, unknown, loading });

  if (display === 'none') {
    return null;
  }

  if (display === 'checking') {
    return (
      <SimpleTableRow
        label={t(translations.exitDelay.checking.label)}
        value={t(translations.exitDelay.checking.value)}
        dataAttribute="exit-delay-checking"
      />
    );
  }

  if (display === 'unknown') {
    return (
      <>
        <SimpleTableRow
          label={
            <span className="flex flex-row items-center gap-1 whitespace-nowrap">
              {t(translations.exitDelay.unknown.label)}
              <HelperButton
                content={t(translations.exitDelay.unknown.tooltip)}
                trigger={TooltipTrigger.click}
                dataAttribute="exit-delay-unknown-helper"
              />
            </span>
          }
          value={t(translations.exitDelay.unknown.value)}
          dataAttribute="exit-delay-unknown"
        />
        <div
          className="mt-2 text-xs text-gray-30"
          data-test-id="exit-delay-unknown-notice"
        >
          {t(translations.exitDelay.unknown.notice)} <VaultLink />
        </div>
      </>
    );
  }

  const { value, unit } = formatDelayDuration(delaySeconds);
  const duration = t(translations.exitDelay.duration[unit], { count: value });

  return (
    <>
      <SimpleTableRow
        label={
          <span className="flex flex-row items-center gap-1 whitespace-nowrap">
            {t(translations.exitDelay.label)}
            <HelperButton
              content={t(translations.exitDelay.tooltip)}
              trigger={TooltipTrigger.click}
              dataAttribute="exit-delay-helper"
            />
          </span>
        }
        value={duration}
        dataAttribute="exit-delay-duration"
      />
      <div
        className="mt-2 text-xs text-gray-30"
        data-test-id="exit-delay-vault-notice"
      >
        {t(translations.exitDelay.vaultNotice)} <VaultLink />
      </div>
    </>
  );
};
