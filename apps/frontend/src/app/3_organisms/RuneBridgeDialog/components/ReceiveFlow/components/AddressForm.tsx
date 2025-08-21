import React, { useCallback } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode.react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@sovryn/tailwindcss-config';
import {
  applyDataAttr,
  ErrorBadge,
  ErrorLevel,
  Icon,
  IconNames,
  NotificationType,
  Paragraph,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../../../../contexts/NotificationContext';
import { translations } from '../../../../../../locales/i18n';
import { URIType } from '../../../../FastBtcDialog/types';
import {
  DEPOSIT_FEE_RUNE_PERCENTAGE,
  MIN_POSTAGE_BTC,
} from '../../../constants';
import { useRuneContext } from '../../../contexts/rune';
import { useRuneBridgeLocked } from '../../../hooks/useRuneBridgeLocked';
import { TransferPolicies } from '../../TransferPolicies';

const config = resolveConfig(tailwindConfig);

export const AddressForm = () => {
  const { depositAddress, tokenBalances } = useRuneContext();
  const { addNotification } = useNotificationContext();
  const runeBridgeLocked = useRuneBridgeLocked();

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(depositAddress);

    addNotification({
      type: NotificationType.success,
      title: t(translations.runeBridge.addressForm.copyAddressSuccess),
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification, depositAddress]);

  if (runeBridgeLocked) {
    return (
      <div className="full">
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.runeBridge)}
        />
      </div>
    );
  }

  return (
    <div className="full">
      <TransferPolicies
        serviceFee={`${DEPOSIT_FEE_RUNE_PERCENTAGE} %`}
        minimumPostage={`${MIN_POSTAGE_BTC} BTC`}
        supportedRunes={tokenBalances.map(tokenBalance => tokenBalance.name)}
        className="mb-6"
      />

      <Paragraph className="font-medium mb-2">
        {t(translations.runeBridge.addressForm.title)}:
      </Paragraph>

      <div className="bg-gray-80 border rounded border-gray-50  text-xs relative">
        <div className="p-6">
          <div
            className={classNames(
              'h-48 justify-center items-center flex rounded bg-white',
            )}
          >
            <QRCode
              value={`${URIType.BITCOIN}${depositAddress}`}
              renderAs="svg"
              bgColor="white"
              fgColor={config?.theme?.colors?.['gray-80'] || 'black'}
              includeMargin={false}
              className="rounded w-36 h-36"
            />
          </div>

          <div className="flex justify-between mt-5 items-center bg-gray-70 border rounded border-gray-50 py-2 pl-3 pr-2 text-gray-30">
            <div className="break-words max-w-11/12">{depositAddress}</div>

            <span
              className="cursor-pointer rounded"
              onClick={copyAddress}
              {...applyDataAttr('funding-receive-address-copy')}
            >
              <Icon icon={IconNames.COPY} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
