import React, { useCallback, useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonStyle,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  FormGroup,
  Input,
  Paragraph,
  ParagraphStyle,
} from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import {
  getServicesConfig,
  parseJwt,
  signMessage,
  validateEmail,
} from '../../../utils/helpers';
import { NotificationUser } from './EmailNotificationSettingsDialog.types';

type EmailNotificationSettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const servicesConfig = getServicesConfig();

const notificationServiceUrl = servicesConfig.notification;
const userEndpoint = `${notificationServiceUrl}user/`;

export const EmailNotificationSettingsDialog: React.FC<
  EmailNotificationSettingsDialogProps
> = ({ isOpen, onClose }) => {
  const { account, provider } = useAccount();
  const { t } = useTranslation();

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

  const emailIsValid = useMemo(() => !email || validateEmail(email), [email]);

  const resetNotification = useCallback(() => {
    setNotificationToken(null);
    setNotificationUser(null);
    setNotificationWallet(null);
    setEmail('');
  }, []);

  const isSubmitDisabled = useMemo(
    () =>
      loading ||
      !notificationToken ||
      !emailIsValid ||
      !email ||
      email === notificationUser?.email,
    [email, emailIsValid, loading, notificationToken, notificationUser?.email],
  );

  const shouldFetchToken = useMemo(
    () => isOpen && !notificationToken,
    [isOpen, notificationToken],
  );

  const shouldFetchUser = useMemo(
    () => notificationToken && isOpen && !notificationUser,
    [isOpen, notificationToken, notificationUser],
  );

  const wasAccountDisconnected = useMemo(
    () =>
      (notificationToken && !account) ||
      (account && notificationWallet !== account),
    [account, notificationToken, notificationWallet],
  );

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
          })
          .then(res => {
            if (res.data && res.data.token) {
              setNotificationToken(res.data.token);
              setNotificationWallet(account);
            }
          }),
      )
      .catch(error => {
        console.error(error);
        onClose();
      });
  }, [account, onClose, provider]);

  const handleUserDataResponse = useCallback(
    (response: Promise<any>) => {
      response
        .then(result => {
          if (result.data) {
            setNotificationUser(result.data);
            setEmail(result.data?.email);
          }
        })
        .catch(error => {
          console.log(error);
          if (error?.response?.status === 401) {
            getToken();
          }
        })
        .finally(() => setLoading(false));
    },
    [getToken],
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

    const promise = axios.put(
      `${userEndpoint}${account}`,
      {
        walletAddress: account,
        email: email || undefined,
      },
      {
        headers: {
          Authorization: 'bearer ' + notificationToken,
        },
      },
    );

    handleUserDataResponse(promise);
  }, [account, email, handleUserDataResponse, notificationToken]);

  const onCloseHandler = useCallback(() => {
    setEmail(notificationUser?.email || '');
    onClose();
  }, [notificationUser?.email, onClose]);

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
          >
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder={t(
                translations.emailNotificationsDialog.emailInputPlaceholder,
              )}
              disabled={loading || !notificationToken}
            />
          </FormGroup>
          <div className="bg-gray-80 rounded p-4">
            A placeholder for toggle switch buttons
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Button
            onClick={onCloseHandler}
            text={t(translations.common.buttons.cancel)}
            style={ButtonStyle.secondary}
            className="mr-4 w-[49%]"
          />
          <Button
            onClick={updateUser}
            text={t(translations.common.buttons.save)}
            disabled={isSubmitDisabled}
            className="w-[49%]"
          />
        </div>
      </DialogBody>
    </Dialog>
  );
};
