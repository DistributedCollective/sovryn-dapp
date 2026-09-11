import React, { useCallback } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';

import { NotificationType } from '@sovryn/ui';

import { useNotificationContext } from '../../contexts/NotificationContext';
import { translations } from '../../locales/i18n';
import { ExitDelayQuote, getExitDelayDisplay } from '../../utils/exitDelay';

/** Long enough to survive the success toast that follows it. */
const HOLD_TOAST_TIMEOUT_MS = 30_000;

/**
 * Post-signature notice that a withdrawal went to the Perimeter vault.
 *
 * A held withdrawal does not arrive in the wallet, so a flow that only reports
 * success reads as money missing. The returned callback is attached to the
 * withdrawal transaction's `onComplete`, and fires a notification naming where
 * the funds are and linking to the page that releases them.
 *
 * Pass the same quote the form displayed, so the notice and the form agree. A
 * quote that arrived saying nothing is held makes the callback a no-op and
 * unheld flows keep their exact current behaviour. A quote we could not obtain,
 * or one that had not arrived when the callback was made, gets the "may be
 * held" notice: the transaction that just succeeded is then one whose funds
 * may be sitting in the vault.
 */
export const usePerimeterHoldToast = (quote: ExitDelayQuote) => {
  const { addNotification } = useNotificationContext();
  const display = getExitDelayDisplay(quote);

  return useCallback(() => {
    if (display === 'none') {
      return;
    }
    const isUnknown = display !== 'held';
    addNotification(
      {
        type: NotificationType.info,
        id: nanoid(),
        title: t(
          isUnknown
            ? translations.exitDelay.holdToast.unknownTitle
            : translations.exitDelay.holdToast.title,
        ),
        content: (
          <>
            {t(
              isUnknown
                ? translations.exitDelay.holdToast.unknownContent
                : translations.exitDelay.holdToast.content,
            )}{' '}
            <Link
              to="/perimeter"
              className="underline"
              data-test-id="perimeter-hold-toast-link"
            >
              {t(translations.exitDelay.vaultLink)}
            </Link>
          </>
        ),
        dismissible: true,
      },
      HOLD_TOAST_TIMEOUT_MS,
    );
  }, [addNotification, display]);
};
