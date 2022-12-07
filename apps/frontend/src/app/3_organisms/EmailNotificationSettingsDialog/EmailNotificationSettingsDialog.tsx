import React, { useCallback, useEffect, useMemo, useState } from 'react';

import axios from 'axios';

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

export const EmailNotificationSettingsDialog: React.FC<
  EmailNotificationSettingsDialogProps
> = ({ isOpen, onClose }) => {
  const { account, provider } = useAccount();

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
  }, []);

  useEffect(() => {
    if (account && notificationWallet !== account) {
      resetNotification();
    }
  }, [account, notificationWallet, resetNotification]);

  useEffect(() => {
    if (isOpen && !notificationToken) {
      getToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (notificationToken && isOpen && !notificationUser) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationToken, isOpen, notificationUser]);

  useEffect(() => {
    if (isOpen && !account && notificationToken) {
      resetNotification();
    }
  }, [account, isOpen, notificationToken, resetNotification]);

  const getToken = async () => {
    if (!account) {
      return;
    }

    const timestamp = new Date();
    const message = `Login to backend on: ${timestamp}`;

    const { data: alreadyUser } = await axios.get(
      notificationServiceUrl + 'user/isUser/' + account,
    );

    return signMessage(provider, message)
      .then(signedMessage =>
        axios
          .post(
            notificationServiceUrl +
              'user/' +
              (alreadyUser ? 'auth' : 'register'),
            {
              signedMessage,
              message,
              walletAddress: account,
            },
          )
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
  };

  const getUser = () => {
    if (!account || !notificationToken) {
      return;
    }

    const userId = parseJwt(notificationToken)?.sub;

    if (!userId) {
      return;
    }

    setLoading(true);

    axios
      .get(notificationServiceUrl + 'user/' + userId, {
        headers: {
          Authorization: 'bearer ' + notificationToken,
        },
      })
      .then(res => {
        if (res.data) {
          setNotificationUser(res.data);
          setEmail(res.data?.email);
        }
      })
      .catch(error => {
        console.log(error);
        if (error?.response?.status === 401) {
          getToken();
        }
      })
      .finally(() => setLoading(false));
  };

  const updateUser = () => {
    if (!account || !notificationToken) {
      return;
    }

    const userId = parseJwt(notificationToken)?.sub;
    if (!userId) {
      return;
    }

    setLoading(true);

    axios
      .put(
        notificationServiceUrl + 'user/' + account,
        {
          walletAddress: account,
          email: email || undefined,
        },
        {
          headers: {
            Authorization: 'bearer ' + notificationToken,
          },
        },
      )
      .then(res => {
        if (res.data) {
          setNotificationUser(res.data);
          setEmail(res.data?.email);
        }
        onClose();
      })
      .catch(error => {
        console.log(error);
        if (error?.response?.status === 401) {
          getToken();
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog isOpen={isOpen} width={DialogSize.sm}>
      <DialogHeader onClose={onClose} title="Notifications" />
      <DialogBody className="p-6">
        <div className="p-6 bg-gray-90">
          <Paragraph style={ParagraphStyle.tall}>
            Notifications on the status of your line of credit are sent to your
            email after you sign it with your wallet
          </Paragraph>
          <FormGroup className="mt-6 mb-4" label="Email address">
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              disabled={loading || !notificationToken}
            />
          </FormGroup>
          <div className="bg-gray-80 rounded p-4">
            A placeholder for toggle switch buttons
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Button
            onClick={onClose}
            text="Cancel"
            style={ButtonStyle.secondary}
            className="mr-4 w-[49%]"
          />
          <Button
            onClick={updateUser}
            text="Save"
            disabled={loading || !notificationToken || !emailIsValid}
            className="w-[49%]"
          />
        </div>
      </DialogBody>
    </Dialog>
  );
};
