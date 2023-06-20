import React, { useContext, useMemo } from 'react';

import { t } from 'i18next';

import {
  Button,
  Heading,
  HeadingType,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../../locales/i18n';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { SendContext } from '../../../contexts/send-context';
import { getNetwork } from '../../../utils/networks';

const translation = translations.fastBtc.send.detailsScreen;

const rskExplorerUrl = getRskExplorerUrl();
const btcExplorerUrl = getBtcExplorerUrl();

type DetailsScreenProps = {
  onConfirm: () => void;
};

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ onConfirm }) => {
  const { senderAsset, recipientAsset, originNetwork, amount } =
    useContext(SendContext);

  const items = useMemo(
    () => [
      {
        label: t(translation.from),
        value: (
          <TxIdWithNotification
            value={'0x1234567890abcdef1234567890abcdef12345678'}
            href={`${rskExplorerUrl}/address/0x1234567890abcdef1234567890abcdef12345678`}
          />
        ),
      },
      {
        label: t(translation.to),
        value: (
          <TxIdWithNotification
            value={'0x1234567890abcdef1234567890abcdef12345678'}
            href={`${btcExplorerUrl}/address/0x1234567890abcdef1234567890abcdef12345678`}
          />
        ),
      },
      {
        label: t(translation.sending),
        value: (
          <>
            {formatValue(amount, 4)} {senderAsset!.toUpperCase()}
          </>
        ),
      },
      {
        label: t(translation.conversionFee),
        value: (
          <>
            {formatValue(0, 4)} {recipientAsset!.toUpperCase()}
          </>
        ),
      },
      {
        label: t(translation.expectedToReceive),
        value: (
          <>
            {formatValue(0, 4)} {recipientAsset!.toUpperCase()}
          </>
        ),
      },
      {
        label: t(translation.minimumReceived),
        value: (
          <>
            {formatValue(0, 4)} {recipientAsset!.toUpperCase()}
          </>
        ),
      },
      {
        label: t(translation.networkTxId, { network: 'Rootstock' }),
        value: (
          <TxIdWithNotification
            value={'0x1234567890abcdef1234567890abcdef12345678'}
            href={`${rskExplorerUrl}/tx/0x1234567890abcdef1234567890abcdef12345678`}
          />
        ),
      },
      {
        label: t(translation.networkTxId, {
          network: getNetwork(originNetwork!).label,
        }),
        value: (
          <TxIdWithNotification
            value={'0x1234567890abcdef1234567890abcdef12345678'}
            href={`${rskExplorerUrl}/tx/0x1234567890abcdef1234567890abcdef12345678`}
          />
        ),
      },
    ],
    [amount, senderAsset, recipientAsset, originNetwork],
  );

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium mb-8 text-center">
        {t(translation.title)}
      </Heading>

      <SimpleTable className="w-full">
        {items.map(({ label, value }, index) => (
          <SimpleTableRow label={label} value={value} />
        ))}
      </SimpleTable>

      <div className="mt-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          onClick={onConfirm}
          dataAttribute="funding-send-details-confirm"
        />
      </div>
    </>
  );
};
