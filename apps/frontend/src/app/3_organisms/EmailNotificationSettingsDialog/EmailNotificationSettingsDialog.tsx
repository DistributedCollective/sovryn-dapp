import React, { useCallback, useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  FormGroup,
  Input,
  NotificationType,
  Paragraph,
  ParagraphStyle,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useRequiredChain } from '../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../hooks/useAccount';
import { useChainStore } from '../../../hooks/useChainStore';
import { translations } from '../../../locales/i18n';
import { isRskChain } from '../../../utils/chain';
import {
  getServicesConfig,
  signMessage,
  validateEmail,
  validateJwt,
} from '../../../utils/helpers';
import {
  NotificationUser,
  defaultSubscriptionsArray,
} from './EmailNotificationSettingsDialog.types';
import { Subscriptions } from './components/Subscriptions';
import {
  EmailNotificationSettingsContextProvider,
  useEmailNotificationSettingsContext,
} from './contexts/EmailNotificationSettingsContext';
import { useHandleSubscriptions } from './hooks/useHandleSubscriptions';

const servicesConfig = getServicesConfig();

const notificationServiceUrl = servicesConfig.notification;
const userEndpoint = `${notificationServiceUrl}user/`;

type EmailNotificationSettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EmailNotificationSettingsDialogComponent: React.FC<
  EmailNotificationSettingsDialogProps
> = ({ isOpen, onClose }) => {
  const { invalidChain } = useRequiredChain();
  const { account, eip1193Provider: provider } = useAccount();
  const { addNotification } = useNotificationContext();
  const { currentChainId } = useChainStore();

  const [notificationToken, setNotificationToken] = useState<string | null>(
    null,
  );
  const [notificationUser, setNotificationUser] =
    useState<NotificationUser | null>(null);
  const [notificationWallet, setNotificationWallet] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const { subscriptions, haveSubscriptionsBeenUpdated } =
    useEmailNotificationSettingsContext();

  const { resetSubscriptions, parseSubscriptionsResponse } =
    useHandleSubscriptions();

  const onCloseHandler = useCallback(() => {
    setEmail(notificationUser?.email || '');
    onClose();
  }, [notificationUser?.email, onClose]);

  const isValidEmail = useMemo(() => !email || validateEmail(email), [email]);

  const isEmailInputDisabled = useMemo(
    () => !notificationToken || !account || loading,
    [notificationToken, account, loading],
  );

  const hasUnconfirmedEmail = useMemo(
    () =>
      notificationUser &&
      email &&
      email === notificationUser.email &&
      !notificationUser.isEmailConfirmed,
    [email, notificationUser],
  );

  const resetNotification = useCallback(() => {
    setNotificationToken(null);
    setNotificationUser(null);
    setNotificationWallet(null);
    setEmail('');
    resetSubscriptions();
  }, [resetSubscriptions]);

  const areSubscriptionsDisabled = useMemo(
    () => !notificationToken || loading,
    [loading, notificationToken],
  );

  const isSubmitDisabled = useMemo(
    () =>
      loading ||
      !notificationToken ||
      !isValidEmail ||
      (!email && !notificationUser?.isEmailConfirmed) ||
      (email === notificationUser?.email && !haveSubscriptionsBeenUpdated) ||
      invalidChain,
    [
      loading,
      notificationToken,
      isValidEmail,
      email,
      notificationUser?.isEmailConfirmed,
      notificationUser?.email,
      haveSubscriptionsBeenUpdated,
      invalidChain,
    ],
  );

  const shouldFetchToken = useMemo(
    () => isOpen && !notificationToken && isRskChain(currentChainId),
    [isOpen, notificationToken, currentChainId],
  );

  const shouldFetchUser = useMemo(
    () => notificationToken && isOpen && isRskChain(currentChainId),
    [isOpen, notificationToken, currentChainId],
  );

  const wasAccountDisconnected = useMemo(
    () =>
      (notificationToken && !account) ||
      (account && notificationWallet !== account),
    [account, notificationToken, notificationWallet],
  );

  const hasUnsavedChanges = useMemo(() => {
    const { email: serverEmail, isEmailConfirmed } = notificationUser || {};

    return (
      haveSubscriptionsBeenUpdated ||
      (isValidEmail &&
        email !== serverEmail &&
        (email !== '' || isEmailConfirmed))
    );
  }, [notificationUser, isValidEmail, email, haveSubscriptionsBeenUpdated]);

  useEffect(() => {
    if (wasAccountDisconnected) {
      resetNotification();
    }
  }, [resetNotification, wasAccountDisconnected]);

  useEffect(() => {
    if (shouldFetchToken) {
      getToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchToken]);

  useEffect(() => {
    if (shouldFetchUser) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchUser]);

  const handleAuthenticationError = useCallback(() => {
    addNotification({
      type: NotificationType.error,
      title: t(translations.emailNotificationsDialog.authErrorMessage),
      dismissible: true,
      id: nanoid(),
    });

    onClose();
  }, [addNotification, onClose]);

  const getToken = useCallback(async () => {
    if (!account) {
      return;
    }

    const storedToken = getStoredToken(account);
    if (storedToken && validateJwt(storedToken)) {
      setNotificationToken(storedToken);
      setNotificationWallet(account);
      return;
    }

    const timestamp = new Date();
    const message = `Login to Sovryn on: ${timestamp}`;

    return signMessage(provider, message)
      .then(signedMessage =>
        axios
          .post(`${userEndpoint}auth`, {
            signedMessage,
            message,
            walletAddress: account,
            // create default subscriptions for new users
            subscriptions: defaultSubscriptionsArray,
          })
          .then(res => {
            if (res.data && res.data.token) {
              setNotificationToken(res.data.token);
              setNotificationWallet(account);
              storeToken(account, res.data.token);
            }
          }),
      )
      .catch(handleAuthenticationError);
  }, [account, provider, handleAuthenticationError]);

  const handleUserDataResponse = useCallback(
    (response: Promise<any>, showNotifications: boolean = false) => {
      response
        .then(result => {
          if (result.data) {
            const { data } = result;

            setNotificationUser(data);
            setEmail(data?.email || '');
            parseSubscriptionsResponse(data?.subscriptions);

            if (showNotifications) {
              addNotification({
                type: NotificationType.success,
                title: t(translations.emailNotificationsDialog.successMessage),
                dismissible: true,
                id: nanoid(),
              });
            }
          }
        })
        .catch(() => {
          if (showNotifications) {
            addNotification({
              type: NotificationType.error,
              title: t(translations.emailNotificationsDialog.errorMessage),
              dismissible: true,
              id: nanoid(),
            });
          }
          handleAuthenticationError();
        })
        .finally(() => setLoading(false));
    },
    [parseSubscriptionsResponse, addNotification, handleAuthenticationError],
  );

  const handleEmailDelete = useCallback(() => {
    onClose();
    resetNotification();

    addNotification({
      type: NotificationType.success,
      title: t(translations.emailNotificationsDialog.unsubscribed),
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification, onClose, resetNotification]);

  const handleUserDelete = useCallback(
    (response: Promise<any>) => {
      response
        .then(handleEmailDelete)
        .catch(handleAuthenticationError)
        .finally(() => setLoading(false));
    },
    [handleAuthenticationError, handleEmailDelete],
  );

  const getUser = useCallback(() => {
    if (!account || !notificationToken) {
      return;
    }

    if (!validateJwt(notificationToken)) {
      getToken();
      return;
    }

    setLoading(true);

    const promise = axios.get(userEndpoint, {
      headers: {
        Authorization: 'bearer ' + notificationToken,
      },
    });

    handleUserDataResponse(promise);
  }, [account, getToken, handleUserDataResponse, notificationToken]);

  const updateUser = useCallback(() => {
    if (!account || !notificationToken) {
      return;
    }

    if (!validateJwt(notificationToken)) {
      getToken();
      return;
    }

    setLoading(true);

    if (email?.length === 0) {
      const promise = axios.delete(userEndpoint, {
        headers: {
          Authorization: 'bearer ' + notificationToken,
        },
      });

      handleUserDelete(promise);
    } else {
      const promise = axios.put(
        userEndpoint,
        {
          walletAddress: account,
          email: email || undefined,
          subscriptions: subscriptions || defaultSubscriptionsArray,
        },
        {
          headers: {
            Authorization: 'bearer ' + notificationToken,
          },
        },
      );

      handleUserDataResponse(promise, true);
    }
  }, [
    account,
    email,
    getToken,
    handleUserDataResponse,
    handleUserDelete,
    notificationToken,
    subscriptions,
  ]);

  const errorLabel = useMemo(() => {
    if (hasUnconfirmedEmail) {
      return t(translations.emailNotificationsDialog.unconfirmedEmailWarning);
    } else if (!!notificationUser && !isValidEmail) {
      return t(translations.emailNotificationsDialog.invalidEmail);
    }
  }, [hasUnconfirmedEmail, notificationUser, isValidEmail]);

  return (
    <Dialog isOpen={isOpen} width={DialogSize.sm}>
      <DialogHeader
        onClose={onCloseHandler}
        title={t(translations.emailNotificationsDialog.dialogTitle)}
      />
      <DialogBody className="p-6">
        <NetworkBanner requiredChainId={RSK_CHAIN_ID}>
          <div className="p-6 bg-gray-90">
            <Paragraph style={ParagraphStyle.tall}>
              {t(translations.emailNotificationsDialog.title)}
            </Paragraph>

            <FormGroup
              className="mt-6 mb-4"
              label={t(translations.emailNotificationsDialog.emailInputLabel)}
              errorLabel={errorLabel}
            >
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder={t(
                  translations.emailNotificationsDialog.emailInputPlaceholder,
                )}
                disabled={isEmailInputDisabled}
                dataAttribute="alert-signup-email"
              />
            </FormGroup>

            <Subscriptions
              isDisabled={areSubscriptionsDisabled}
              dataAttribute="alert-signup-sub"
            />
          </div>

          <div className="mt-4 flex flex-col items-center">
            {hasUnsavedChanges && (
              <Paragraph className="text-error mb-2">
                {t(translations.emailNotificationsDialog.unsavedChanges)}
              </Paragraph>
            )}

            <Button
              onClick={updateUser}
              text={t(translations.common.buttons.save)}
              disabled={isSubmitDisabled}
              className="w-full"
              dataAttribute="alert-signup-save"
            />
          </div>
        </NetworkBanner>
      </DialogBody>
    </Dialog>
  );
};

export const EmailNotificationSettingsDialog: React.FC<
  EmailNotificationSettingsDialogProps
> = ({ isOpen, onClose }) => (
  <EmailNotificationSettingsContextProvider>
    <EmailNotificationSettingsDialogComponent
      isOpen={isOpen}
      onClose={onClose}
    />
  </EmailNotificationSettingsContextProvider>
);

function getStoredToken(account: string) {
  return localStorage.getItem(`notification-token-${account}`);
}

function storeToken(account: string, token: string) {
  localStorage.setItem(`notification-token-${account}`, token);
}
