import React, { useCallback, useContext, useMemo } from 'react';

import classNames from 'classnames';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@sovryn/tailwindcss-config';
import {
  prettyTx,
  Icon,
  IconNames,
  Paragraph,
  NotificationType,
  Lottie,
  ParagraphStyle,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../../../../contexts/NotificationContext';
import { translations } from '../../../../../../locales/i18n';
import { DepositContext } from '../../../contexts/deposit-context';
import { useValidateFederators } from '../../../hooks/useValidateFederators';
import { URIType } from '../../../types';
import { TransferPolicies } from './TransferPolicies';

const config = resolveConfig(tailwindConfig);

export const AddressForm: React.FC = () => {
  const { t } = useTranslation();

  const { address } = useContext(DepositContext);
  const { addNotification } = useNotificationContext();

  const { isSignatureValid, loading } = useValidateFederators();

  console.log(`isSignatureValid: ${isSignatureValid} , loading: ${loading}`);

  const formattedAddress = useMemo(() => prettyTx(address, 12, 12), [address]);

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(address);

    addNotification({
      type: NotificationType.success,
      title: t(translations.fastBtc.addressForm.copyAddressSuccess),
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification, address, t]);

  const hasValidationBeenUnsuccessful = useMemo(
    () => !loading && !isSignatureValid,
    [isSignatureValid, loading],
  );

  return (
    <>
      <div className="full">
        <TransferPolicies />

        <Paragraph className="font-medium mb-2">
          {t(translations.fastBtc.addressForm.title)}:
        </Paragraph>

        <div className="bg-gray-80 border rounded border-gray-50  text-xs relative">
          {(loading || !isSignatureValid) && (
            <div className="absolute w-full h-full backdrop-blur-md">
              {loading && <Lottie animation="progressDots" />}
              {hasValidationBeenUnsuccessful && (
                <div className="flex items-center h-full">
                  <Paragraph
                    children={t(
                      translations.fastBtc.addressForm.invalidSignatures,
                    )}
                    style={ParagraphStyle.tall}
                    className="px-14 flex-items-center text-center"
                  />
                </div>
              )}
            </div>
          )}

          <div className="p-6">
            <div
              className={classNames(
                'h-48 justify-center items-center flex rounded',
                {
                  'bg-white': !hasValidationBeenUnsuccessful,
                },
              )}
            >
              <QRCode
                value={`${URIType.BITCOIN}${address}`}
                renderAs="svg"
                bgColor="white"
                fgColor={config?.theme?.colors?.['gray-80'] || 'black'}
                includeMargin={false}
                className="rounded w-36 h-36"
              />
            </div>

            <div className="flex justify-between mt-5 items-center bg-gray-70 border rounded border-gray-50 py-2 pl-3 pr-2 text-gray-30">
              <div>{formattedAddress}</div>

              <span className="cursor-pointer rounded" onClick={copyAddress}>
                <Icon icon={IconNames.COPY} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
