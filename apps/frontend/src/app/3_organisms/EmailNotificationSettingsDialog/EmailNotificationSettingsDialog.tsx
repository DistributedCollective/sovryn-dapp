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

import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import {
  getServicesConfig,
  parseJwt,
  signMessage,
  validateEmail,
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
  const { account, eip1193Provider: provider } = useAccount();
  const { addNotification } = useNotificationContext();

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
      (email === notificationUser?.email && !haveSubscriptionsBeenUpdated),
    [
      email,
      isValidEmail,
      loading,
      notificationToken,
      notificationUser,
      haveSubscriptionsBeenUpdated,
    ],
  );

  const shouldFetchToken = useMemo(
    () => isOpen && !notificationToken,
    [isOpen, notificationToken],
  );

  const shouldFetchUser = useMemo(
    () => notificationToken && isOpen,
    [isOpen, notificationToken],
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

    const timestamp = new Date();
    const message = `Login to backend on: ${timestamp}`;

    const { data: alreadyUser } = await axios.get(
      `${userEndpoint}/isUser/${account}`,
    );

    return signMessage(provider, message)
      .then(signedMessage =>
        axios
          .post(`${userEndpoint}${alreadyUser ? 'auth' : 'register'}`, {
            signedMessage,
            message,
            walletAddress: account,
            ...(alreadyUser
              ? ''
              : { subscriptions: defaultSubscriptionsArray }),
          })
          .then(res => {
            if (res.data && res.data.token) {
              setNotificationToken(res.data.token);
              setNotificationWallet(account);
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
            setEmail(data?.email);
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
        .catch(error => {
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

    const userId = parseJwt(notificationToken)?.sub;

    if (!userId) {
      return;
    }

    setLoading(true);

    const promise = axios.get(`${userEndpoint}${userId}`, {
      headers: {
        Authorization: 'bearer ' + notificationToken,
      },
    });

    handleUserDataResponse(promise);
  }, [account, handleUserDataResponse, notificationToken]);

  const updateUser = useCallback(() => {
    if (!account || !notificationToken) {
      return;
    }

    const userId = parseJwt(notificationToken)?.sub;
    if (!userId) {
      return;
    }

    setLoading(true);

    if (email?.length === 0) {
      const promise = axios.delete(`${userEndpoint}${userId}`, {
        headers: {
          Authorization: 'bearer ' + notificationToken,
        },
      });

      handleUserDelete(promise);
    } else {
      const promise = axios.put(
        `${userEndpoint}${account}`,
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
