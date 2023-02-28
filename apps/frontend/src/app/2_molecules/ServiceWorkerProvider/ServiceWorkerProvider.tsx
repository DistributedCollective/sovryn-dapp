/**
 *
 * ServiceWorkerToaster
 *
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { register, unregister } from '../../../serviceWorkerRegistration';

const publicUrl = process.env.PUBLIC_URL ?? window.location.origin;
const enableWorker = process.env.REACT_APP_ENABLE_SERVICE_WORKER === 'true';

//interval time to check sw
const CHECK_TIME = 30e3; // 30 seconds
const REOPEN_TIME = 120e3; // 120 seconds
const versionUrl = `${publicUrl}/release.json`;

const currentCommit = process.env.REACT_APP_GIT_COMMIT_ID || '';

type VersionFileContent = {
  version: string;
  forcedCount: number;
  commit: string;
  comment?: string;
};

export const ServiceWorkerProvider = () => {
  const { addNotification } = useNotificationContext();
  const [state, setState] = useState<VersionFileContent>({
    version: '0.0',
    forcedCount: 0,
    commit: '',
  });
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration>();

  const fetchVersion = useCallback(async () => {
    return fetch(versionUrl, {
      headers: {
        'Service-Worker': 'script',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
      .then(async response => {
        const data = await response.json();
        if (!data) return;
        setState(data);
      })
      .catch(() => {});
  }, [setState]);

  useEffect(() => {
    if (
      enableWorker &&
      currentCommit &&
      state.commit &&
      currentCommit !== state.commit
    ) {
      if (swRegistration && swRegistration.update) {
        // Don't setShow(true) yet. Calling update triggers onUpdate below.
        swRegistration.update();
      } else {
        addNotification({
          id: 'update',
          title: 'page updated',
          content: 'wtf',
        });
      }
    }
  }, [swRegistration, state.commit, addNotification]);

  const updateSW = () => {
    if (swRegistration) {
      const waitingWorker = swRegistration && swRegistration.waiting;
      waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      unregister();
    }
    fetch(`/clear-site-data`).finally(() =>
      window.location.replace(window.location.href),
    );
  };

  useEffect(() => {
    fetchVersion();
    register({
      onUpdate: async registration => {
        setSwRegistration(registration);
        if (state.commit === currentCommit) {
          await fetchVersion();
        }
        addNotification({
          id: 'update',
          title: 'page updated',
          content: 'wtf',
        });
      },
      onSuccess: registration => {
        setSwRegistration(registration);
      },
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (enableWorker) {
      const intId = setInterval(() => fetchVersion(), CHECK_TIME);
      return () => clearInterval(intId);
    }
    // eslint-disable-next-line
  }, []);

  return <></>;
};
