import React, { useCallback, useContext, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Align,
  Button,
  ButtonStyle,
  Heading,
  HeadingType,
  TableBase,
  TransactionId,
} from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';
import { SendContext, SendStep } from '../../../contexts/send-context';
import { getNetwork } from '../../../utils/networks';

const translation = translations.fastBtc.send.recipientScreen;

const columns = [
  {
    id: 'asset',
    title: t(translation.table.asset),
    align: Align.left,
    cellRenderer: row => `${row.asset.toUpperCase()}`,
  },
  {
    id: 'address',
    title: t(translation.table.address),
    align: Align.center,
    cellRenderer: row => (
      <TransactionId
        href="#"
        value={row.address}
        dataAttribute={`funding-send-recipient-asset-id`}
      />
    ),
  },
  {
    id: 'availableLiquidity',
    title: t(translation.table.availableLiquidity),
    align: Align.right,
    cellRenderer: row => `${row.balance} ${row.asset.toUpperCase()}`,
  },
];

const rows = [
  {
    asset: 'BUSD',
    address: '0x1234567890123456789012345678901234567890',
    balance: 0.2,
  },
  {
    asset: 'DAI',
    address: '0x0p42490ACCbc50F4F9c130b5876521I1q7b3C0p',
    balance: 1.234,
  },
  {
    asset: 'USDC',
    address: '0x6p42490ACCbc50F4F9c130b5876521I1q7b3C0p',
    balance: 4,
  },
];

export const RecipientAssetScreen: React.FC = () => {
  const { set, originNetwork } = useContext(SendContext);
  const [selectedAsset, setSelectedAsset] = useState<SupportedTokens>();

  const networkName = useMemo(
    () => getNetwork(originNetwork!).label,
    [originNetwork],
  );

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        step: SendStep.AMOUNT,
        recipientAsset: selectedAsset!,
      })),
    [selectedAsset, set],
  );

  const onRowClick = useCallback(row => setSelectedAsset(row.asset), []);

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translation.title, { network: networkName })}
      </Heading>

      <TableBase
        columns={columns}
        rows={rows}
        dataAttribute="funding-send-recipient-asset-table"
        onRowClick={onRowClick}
        isClickable
        className="whitespace-nowrap"
      />

      <Button
        onClick={onContinueClick}
        text={t(translations.common.buttons.continue)}
        className="w-full mt-8"
        style={ButtonStyle.secondary}
        dataAttribute="funding-send-recipient-asset"
        disabled={!selectedAsset}
      />
    </div>
  );
};
