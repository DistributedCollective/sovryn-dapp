import React, { FC } from 'react';

import { t } from 'i18next';
import { Link } from 'react-router-dom';

import { HelperButton, SimpleTableRow, TooltipTrigger } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import {
  formatDelayDuration,
  isExitDelayShown,
} from '../../../utils/exitDelay';

export type ExitDelayRowProps = {
  /** Seconds the perimeter will hold this withdrawal; 0 renders nothing. */
  delaySeconds: number;
};

/**
 * Tells the holder, before they sign, that this withdrawal will be held rather
 * than paid straight out — for how long, where it goes, and where to release
 * it from. The destination notice is visible in the form itself, not tucked
 * behind the tooltip: a held withdrawal does not arrive, and a user who was
 * only told about a fee would read that as money missing.
 *
 * Renders only when the perimeter actually imposes a delay. While it is
 * deployed-but-disabled, or the account is exempt, `delaySeconds` is zero and
 * the form looks exactly as it does without the perimeter.
 */
export const ExitDelayRow: FC<ExitDelayRowProps> = ({ delaySeconds }) => {
  if (!isExitDelayShown(delaySeconds)) {
    return null;
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
        {t(translations.exitDelay.vaultNotice)}{' '}
        <Link
          to="/perimeter"
          className="text-primary-20 underline hover:no-underline"
          data-test-id="exit-delay-vault-link"
        >
          {t(translations.exitDelay.vaultLink)}
        </Link>
      </div>
    </>
  );
};
