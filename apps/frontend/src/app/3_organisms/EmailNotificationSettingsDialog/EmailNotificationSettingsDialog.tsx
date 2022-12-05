import React, { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  FormGroup,
  Input,
  Paragraph,
} from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { parseJwt, signMessage } from '../../../utils/helpers';
import { NotificationUser } from './EmailNotificationSettingsDialog.types';

type EmailNotificationSettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const url = 'https://notify.test.sovryn.app/'; //TODO: Adjust once https://github.com/DistributedCollective/sovryn-dapp/pull/112 is merged into dev

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

  //   const emailIsValid = useMemo(() => !email || validateEmail(email), [email]);

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

  const getToken = async () => {
    if (!account) {
      return;
    }

    const timestamp = new Date();
    const message = `Login to backend on: ${timestamp}`;

    const { data: alreadyUser } = await axios.get(
      url + 'user/isUser/' + account,
    );

    return signMessage(provider, message)
      .then(signedMessage =>
        axios
          .post(url + 'user/' + (alreadyUser ? 'auth' : 'register'), {
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
      .get(url + 'user/' + userId, {
        headers: {
          Authorization: 'bearer ' + notificationToken,
        },
      })
      .then(res => {
        if (res.data) {
          //   console.log(`getUser data: ${JSON.stringify(res.data)}`);
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
        url + 'user/' + account,
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
          <Paragraph>
            Notifications on the status of your line of credit are sent to your
            email after you sign it with your wallet
          </Paragraph>
          <FormGroup className="mt-6" label="Email address">
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
            />
          </FormGroup>
        </div>

        <div className="mt-4">
          <Button
            onClick={updateUser}
            text="Save"
            disabled={loading || !notificationToken}
          />
        </div>
      </DialogBody>
    </Dialog>
  );
};
