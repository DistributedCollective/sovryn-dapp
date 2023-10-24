import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  FC,
  PropsWithChildren,
} from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Button, NotificationType, Overlay, Paragraph } from '@sovryn/ui';

import { CURRENT_RELEASE } from '../../../constants/general';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { translations } from '../../../locales/i18n';
import { register, unregister } from '../../../serviceWorkerRegistration';
import { ReleaseFileContent } from '../../../types/global';
import { getChangelogUrl } from '../../../utils/helpers';

const publicUrl = process.env.PUBLIC_URL ?? window.location.origin;
const enableWorker = process.env.REACT_APP_ENABLE_SERVICE_WORKER === 'true';

//interval time to check for new release
const CHECK_TIME = 30e3; // 30 seconds
const releaseUrl = `${publicUrl}/release.json`;

export const ServiceWorkerProvider: FC<PropsWithChildren> = ({ children }) => {
  const { addNotification } = useNotificationContext();
  const shownForCommit = useRef<string>(
    `${CURRENT_RELEASE.commit}:${CURRENT_RELEASE.version}:${CURRENT_RELEASE.forcedCount}`,
  );
  const [isForced, setIsForced] = useState(false);
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration>();

  const updateHandler = useCallback(() => {
    if (swRegistration) {
      const waitingWorker = swRegistration && swRegistration.waiting;
      waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      unregister();
    }
    fetch(`/clear-site-data`).finally(() =>
      window.location.replace(window.location.href),
    );
  }, [swRegistration]);

  const showDialog = useCallback(
    (state: ReleaseFileContent) => {
      const isForced = state.forcedCount > CURRENT_RELEASE.forcedCount;
      addNotification(
        {
          id: 'app-update',
          title: t(translations.appUpdateDialog.title),
          content: (
            <>
              <Paragraph className="mb-3">
                <Trans
                  i18nKey={t(translations.appUpdateDialog.changelog)}
                  components={[
                    <a
                      href={getChangelogUrl(CURRENT_RELEASE.commit)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      -
                    </a>,
                  ]}
                />
              </Paragraph>
              <Paragraph className="mb-3">
                {t(translations.appUpdateDialog.description)}
              </Paragraph>
              <Button
                onClick={updateHandler}
                text={t(translations.appUpdateDialog.updateButton)}
              />
            </>
          ),
          dismissible: !isForced,
          type: isForced ? NotificationType.warning : NotificationType.info,
        },
        isForced ? 604800000 : 30000,
      );
    },
    [addNotification, updateHandler],
  );

  const fetchVersion = useCallback(
    () =>
      fetch(releaseUrl, {
        headers: {
          'Service-Worker': 'script',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
        .then(response => response.json() as Promise<ReleaseFileContent>)
        .then(data => {
          const commitKey = `${data.commit}:${data.version}:${data.forcedCount}`;
          if (
            (data.commit !== CURRENT_RELEASE.commit ||
              data.version !== CURRENT_RELEASE.version ||
              data.forcedCount > CURRENT_RELEASE.forcedCount) &&
            shownForCommit.current !== commitKey
          ) {
            if (swRegistration && swRegistration.update) {
              swRegistration.update();
            } else {
              shownForCommit.current = commitKey;
              showDialog(data);
              setIsForced(data.forcedCount > CURRENT_RELEASE.forcedCount);
            }
          }
          return data;
        })
        .catch(() => {}),
    [showDialog, swRegistration],
  );

  useEffect(() => {
    if (enableWorker && process.env.NODE_ENV === 'production') {
      fetchVersion();
      register({
        onUpdate: async registration => {
          setSwRegistration(registration);
          await fetchVersion();
        },
        onSuccess: async registration => {
          setSwRegistration(registration);
          await fetchVersion();
        },
      });

      const intId = setInterval(() => fetchVersion(), CHECK_TIME);
      return () => clearInterval(intId);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {children}
      {isForced && (
        <Overlay portalTarget="body" isOpen={true} children={<></>} />
      )}
    </>
  );
};
