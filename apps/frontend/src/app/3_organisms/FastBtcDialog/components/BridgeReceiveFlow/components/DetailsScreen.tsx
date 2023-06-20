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
import { BITCOIN } from '../../../../../../constants/currencies';
import { translations } from '../../../../../../locales/i18n';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { ReceiveContext } from '../../../contexts/receive-context';
import { getNetwork } from '../../../utils/networks';

const translation = translations.fastBtc.receive.detailsScreen;

const rskExplorerUrl = getRskExplorerUrl();
const btcExplorerUrl = getBtcExplorerUrl();

type DetailsScreenProps = {
  onConfirm: () => void;
};

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ onConfirm }) => {
  const { asset, originNetwork, amount } = useContext(ReceiveContext);

  const items = useMemo(
    () => [
      {
        label: t(translation.from),
        value: (
          <TxIdWithNotification
            value={'0x'}
            href={`${rskExplorerUrl}/address/0x`}
          />
        ),
      },
      {
        label: t(translation.to),
        value: (
          <TxIdWithNotification
            value={'0x'}
            href={`${btcExplorerUrl}/address/0x`}
          />
        ),
      },
      {
        label: t(translation.sending),
        value: (
          <>
            {formatValue(amount, 8)} {asset.toUpperCase()}
          </>
        ),
      },
      {
        label: t(translation.serviceFee),
        value: (
          <>
            {formatValue(0, 8)} {asset.toUpperCase()}
          </>
        ),
      },
      {
        label: t(translation.expectedToReceive),
        value: (
          <>
            {formatValue(0, 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.minimumReceived),
        value: (
          <>
            {formatValue(0, 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.networkTxId, {
          network: getNetwork(originNetwork!).label,
        }),
        value: (
          <TxIdWithNotification value={'0x'} href={`${rskExplorerUrl}/tx/0x`} />
        ),
      },
      {
        label: t(translation.networkTxId, { network: 'Rootstock' }),
        value: (
          <TxIdWithNotification value={'0x'} href={`${rskExplorerUrl}/tx/0x`} />
        ),
      },
    ],
    [amount, asset, originNetwork],
  );

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium mb-8 text-center">
        {t(translation.title)}
      </Heading>

      <SimpleTable border>
        {items.map(({ label, value }) => (
          <SimpleTableRow key={label} label={label} value={value} />
        ))}
      </SimpleTable>

      <div className="mt-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          onClick={onConfirm}
          dataAttribute="funding-receiver-confirm"
        />
      </div>
    </>
  );
};
