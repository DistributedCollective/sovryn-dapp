import React, { useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode.react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@sovryn/tailwindcss-config';
import {
  Icon,
  IconNames,
  NotificationType,
  Paragraph,
  applyDataAttr,
  prettyTx,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../../../../contexts/NotificationContext';
import { translations } from '../../../../../../locales/i18n';
import { URIType } from '../../../types';

type InvoiceScreenProps = {
  invoice: string;
};

const config = resolveConfig(tailwindConfig);

export const InvoiceScreen: React.FC<InvoiceScreenProps> = ({ invoice }) => {
  const { addNotification } = useNotificationContext();

  const formattedAddress = useMemo(() => prettyTx(invoice, 12, 12), [invoice]);

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(invoice);

    addNotification({
      type: NotificationType.success,
      title: t(translations.fastBtc.addressForm.copyAddressSuccess),
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification, invoice]);

  return (
    <div className="px-2">
      <Paragraph className="font-medium mt-4 mb-2 text-left">
        {t(translations.boltz.receive.addressForm.title)}:
      </Paragraph>

      <div className="bg-gray-80 border rounded border-gray-50  text-xs relative">
        <div className="p-6">
          <div className="h-44 justify-center items-center flex rounded bg-white">
            <QRCode
              value={`${URIType.LIGHTNING}${invoice}`}
              renderAs="svg"
              bgColor="white"
              fgColor={config?.theme?.colors?.['gray-80'] || 'black'}
              includeMargin={false}
              className="rounded w-36 h-36"
            />
          </div>

          <div className="flex justify-between mt-5 items-center bg-gray-70 border rounded border-gray-50 py-2 pl-3 pr-2 text-gray-30">
            <div>{formattedAddress}</div>

            <span
              className="cursor-pointer rounded"
              onClick={copyAddress}
              {...applyDataAttr('funding-receive-invoice-copy')}
            >
              <Icon icon={IconNames.COPY} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
