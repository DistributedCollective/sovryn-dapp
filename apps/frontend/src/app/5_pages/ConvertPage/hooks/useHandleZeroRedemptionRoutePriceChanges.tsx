import { useCallback, useEffect, useState } from 'react';
import React from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType, Paragraph, Button, ButtonStyle } from '@sovryn/ui';

import { useNotificationContext } from '../../../../contexts/NotificationContext';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { translations } from '../../../../locales/i18n';

export const useHandleZeroRedemptionRoutePriceChanges = (
  setSubmitPrice: React.Dispatch<React.SetStateAction<string | undefined>>,
  getCurrentPrice: () => Promise<BigNumber>,
  submitPrice?: string,
) => {
  const { setIsOpen } = useTransactionContext();
  const { addNotification, removeNotification } = useNotificationContext();
  const { value: blockNumber } = useBlockNumber();

  const [warningNotificationId, setWarningNotificationId] = useState<
    string | undefined
  >();

  const onUpdateClick = useCallback(() => {
    setIsOpen(false);
    setSubmitPrice(undefined);
  }, [setIsOpen, setSubmitPrice]);

  useEffect(() => {
    if (submitPrice) {
      getCurrentPrice().then(result => {
        if (!result) {
          return;
        }

        const arePricesEqual = BigNumber.from(result).sub(submitPrice).isZero();

        if (!arePricesEqual && !warningNotificationId) {
          const notificationId = nanoid();
          setWarningNotificationId(notificationId);

          addNotification(
            {
              type: NotificationType.warning,
              title: t(translations.convertPage.zeroRedemptionWarning.title),
              content: (
                <>
                  <Paragraph>
                    {t(translations.convertPage.zeroRedemptionWarning.content)}
                  </Paragraph>

                  <Button
                    text={t(translations.common.buttons.update)}
                    onClick={() => {
                      onUpdateClick();
                      removeNotification(notificationId);
                      setWarningNotificationId(undefined);
                    }}
                    style={ButtonStyle.secondary}
                    className="mt-3"
                  />
                </>
              ),
              dismissible: true,
              id: notificationId,
            },
            0,
          );
        }
      });
    }
  }, [
    blockNumber,
    addNotification,
    onUpdateClick,
    warningNotificationId,
    removeNotification,
    submitPrice,
    getCurrentPrice,
  ]);
};
