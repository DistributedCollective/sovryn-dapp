import React, { useCallback } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';

import { NotificationType } from '@sovryn/ui';

import { useNotificationContext } from '../../contexts/NotificationContext';
import { translations } from '../../locales/i18n';

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
 * Pass the same `delaySeconds` the form displayed: the callback is a no-op
 * when it is zero, so unheld flows keep their exact current behaviour.
 */
export const usePerimeterHoldToast = (delaySeconds: number) => {
  const { addNotification } = useNotificationContext();

  return useCallback(() => {
    if (delaySeconds <= 0) {
      return;
    }
    addNotification(
      {
        type: NotificationType.info,
        id: nanoid(),
        title: t(translations.exitDelay.holdToast.title),
        content: (
          <>
            {t(translations.exitDelay.holdToast.content)}{' '}
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
  }, [addNotification, delaySeconds]);
};
