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
  Toggle,
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

enum NotificationMessageType {
  ZeroBelowCcr = 'ZeroBelowCcr',
  ZeroCcr = 'ZeroCcr',
  ZeroCriticalIcrNormal = 'ZeroCriticalIcrNormal',
  ZeroCriticalIcrRecovery = 'ZeroCriticalIcrRecovery',
  ZeroGain = 'ZeroGain',
  ZeroLiquidation = 'ZeroLiquidation',
  ZeroLiquidationSurplus = 'ZeroLiquidationSurplus',
  ZeroLowTcr = 'ZeroLowTcr',
  ZeroRecovery = 'ZeroRecovery',
}

type Notification = {
  notification: NotificationMessageType;
  isSubscribed: boolean;
};

const defaultSubscriptionsArray: Notification[] = [
  {
    notification: NotificationMessageType.ZeroBelowCcr,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroCcr,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroCriticalIcrNormal,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroCriticalIcrRecovery,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroGain,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroLiquidation,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroLiquidationSurplus,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroLowTcr,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroRecovery,
    isSubscribed: false,
  },
];

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

  const [toggleStates, setToggleStates] = useState(defaultSubscriptionsArray);

  const emailIsValid = useMemo(() => !email || validateEmail(email), [email]);

  const resetNotification = useCallback(() => {
    setNotificationToken(null);
    setNotificationUser(null);
    setNotificationWallet(null);
    setEmail('');
    setToggleStates(defaultSubscriptionsArray);
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
      .catch(error => {
        console.error(error);
        onClose();
      });
  }, [account, onClose, provider]);

  const setSubscriptions = useCallback((subscriptions: Notification[]) => {
    let toggleStatesArray: Notification[] = [];

    subscriptions.forEach(item =>
      toggleStatesArray.push({
        notification: item.notification,
        isSubscribed: item.isSubscribed,
      }),
    );

    setToggleStates(toggleStatesArray);
  }, []);

  const isToggled = useCallback(
    (state: NotificationMessageType) =>
      toggleStates.find(item => item.notification === state)?.isSubscribed ||
      false,
    [toggleStates],
  );

  const updateState = useCallback(
    (state: NotificationMessageType) => {
      const newState = toggleStates.map(item => {
        if (item.notification === state) {
          return {
            notification: item.notification,
            isSubscribed: !item.isSubscribed,
          };
        }

        return item;
      });

      setToggleStates(newState);
    },
    [toggleStates],
  );

  const handleUserDataResponse = useCallback(
    (response: Promise<any>) => {
      response
        .then(result => {
          if (result.data) {
            setNotificationUser(result.data);
            setEmail(result.data?.email);
            setSubscriptions(result.data?.subscriptions);
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
    [getToken, setSubscriptions],
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
        subscriptions: toggleStates,
      },
      {
        headers: {
          Authorization: 'bearer ' + notificationToken,
        },
      },
    );

    handleUserDataResponse(promise);
  }, [account, email, handleUserDataResponse, notificationToken, toggleStates]);

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
            <Toggle
              checked={isToggled(NotificationMessageType.ZeroBelowCcr)}
              onChange={() => updateState(NotificationMessageType.ZeroBelowCcr)}
              label="ZeroBelowCcr"
            />
            <Toggle
              checked={isToggled(NotificationMessageType.ZeroCcr)}
              onChange={() => updateState(NotificationMessageType.ZeroCcr)}
              label="ZeroCcr"
            />
            <Toggle
              checked={isToggled(NotificationMessageType.ZeroCriticalIcrNormal)}
              onChange={() =>
                updateState(NotificationMessageType.ZeroCriticalIcrNormal)
              }
              label="ZeroCriticalIcrNormal"
            />
            <Toggle
              checked={isToggled(
                NotificationMessageType.ZeroCriticalIcrRecovery,
              )}
              onChange={() =>
                updateState(NotificationMessageType.ZeroCriticalIcrRecovery)
              }
              label="ZeroCriticalIcrRecovery"
            />
            <Toggle
              checked={isToggled(NotificationMessageType.ZeroGain)}
              onChange={() => updateState(NotificationMessageType.ZeroGain)}
              label="ZeroGain"
            />
            <Toggle
              checked={isToggled(NotificationMessageType.ZeroLiquidation)}
              onChange={() =>
                updateState(NotificationMessageType.ZeroLiquidation)
              }
              label="ZeroLiquidation"
            />
            <Toggle
              checked={isToggled(
                NotificationMessageType.ZeroLiquidationSurplus,
              )}
              onChange={() =>
                updateState(NotificationMessageType.ZeroLiquidationSurplus)
              }
              label="ZeroLiquidationSurplus"
            />
            <Toggle
              checked={isToggled(NotificationMessageType.ZeroLowTcr)}
              onChange={() => updateState(NotificationMessageType.ZeroLowTcr)}
              label="ZeroLowTcr"
            />
            <Toggle
              checked={isToggled(NotificationMessageType.ZeroRecovery)}
              onChange={() => updateState(NotificationMessageType.ZeroRecovery)}
              label="ZeroRecovery"
            />
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
