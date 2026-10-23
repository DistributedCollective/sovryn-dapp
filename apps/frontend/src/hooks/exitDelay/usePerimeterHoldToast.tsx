import React, { useCallback } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';
import { useHref, useNavigate } from 'react-router-dom';

import { NotificationType } from '@sovryn/ui';

import { useNotificationContext } from '../../contexts/NotificationContext';
import { translations } from '../../locales/i18n';
import { ExitDelayQuote, getExitDelayDisplay } from '../../utils/exitDelay';

/** Long enough to survive the success toast that follows it. */
const HOLD_TOAST_TIMEOUT_MS = 30_000;

const PERIMETER_PATH = '/perimeter';

/**
 * Post-signature notice that a withdrawal went to the Perimeter withdraw queue.
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
 * may be sitting in the withdraw queue.
 *
 * The notification provider draws the toast above the Router, so the toast
 * itself cannot use a router `Link`: it throws without a Router ancestor and
 * unmounts the app. The link is a plain anchor built here instead, where the
 * caller is under the Router: the router-aware `href` and the navigation are
 * resolved from this hook's own router context and handed to the anchor. The
 * caller must therefore be rendered under the Router.
 */
export const usePerimeterHoldToast = (quote: ExitDelayQuote) => {
  const { addNotification } = useNotificationContext();
  const display = getExitDelayDisplay(quote);
  const perimeterHref = useHref(PERIMETER_PATH);
  const navigate = useNavigate();

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
            <a
              href={perimeterHref}
              className="underline"
              data-test-id="perimeter-hold-toast-link"
              onClick={event => {
                // Modified and non-primary clicks keep the browser's own
                // behaviour (new tab, download, and so on).
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.altKey ||
                  event.ctrlKey ||
                  event.shiftKey
                ) {
                  return;
                }
                event.preventDefault();
                navigate(PERIMETER_PATH);
              }}
            >
              {t(translations.exitDelay.vaultLink)}
            </a>
          </>
        ),
        dismissible: true,
      },
      HOLD_TOAST_TIMEOUT_MS,
    );
  }, [addNotification, display, navigate, perimeterHref]);
};
