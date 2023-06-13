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
import { ReceiveContext, ReceiveStep } from '../../../contexts/receive-context';
import { getNetwork } from '../utils/networks';

const columns = [
  {
    id: 'asset',
    title: 'Asset',
    align: Align.left,
    cellRenderer: row => `${row.asset.toUpperCase()}`,
  },
  {
    id: 'address',
    title: 'Address',
    align: Align.center,
    cellRenderer: row => (
      <TransactionId
        href="#"
        value={row.address}
        dataAttribute={`funding-send-transaction-id`}
      />
    ),
  },
  {
    id: 'balance',
    title: 'Balance',
    align: Align.right,
    cellRenderer: row => `${row.balance} ${row.asset.toUpperCase()}`,
  },
];

export const AssetList = () => {
  const { set, originNetwork } = useContext(ReceiveContext);

  const networkName = useMemo(
    () => getNetwork(originNetwork!).label,
    [originNetwork],
  );

  //@TODO: Replace with real data
  const walletBalance = [
    {
      asset: SupportedTokens.bnbs,
      address: '0x1234567890123456789012345678901234567890',
      balance: 0.2,
    },
    {
      asset: SupportedTokens.dllr,
      address: '0x0p42490ACCbc50F4F9c130b5876521I1q7b3C0p',
      balance: 1.234,
    },
    {
      asset: SupportedTokens.eths,
      address: '0x6p42490ACCbc50F4F9c130b5876521I1q7b3C0p',
      balance: 4,
    },
    {
      asset: SupportedTokens.rusdt,
      address: '0x6p42490ACCbc50F4F9c130b5876521I1q7b3C0p',
      balance: 4,
    },
    {
      asset: SupportedTokens.rdoc,
      address: '0x6p42490ACCbc50F4F9c130b5876521I1q7b3C0p',
      balance: 4,
    },
  ];

  const [selectedAsset, setSelectedAsset] = useState<SupportedTokens>();

  const onRowClick = useCallback((row: any) => setSelectedAsset(row.asset), []);

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        step: ReceiveStep.AMOUNT,
        asset: selectedAsset!,
      })),
    [selectedAsset, set],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        Select the asset to transfer from {networkName}
      </Heading>

      <TableBase
        columns={columns}
        rows={walletBalance}
        dataAttribute="funding-receiver-asset-table"
        onRowClick={onRowClick}
        isClickable
      />

      <Button
        onClick={onContinueClick}
        text={t(translations.common.buttons.continue)}
        className="w-full mt-8"
        style={ButtonStyle.secondary}
        dataAttribute="funding-receiver-sender-asset"
        disabled={!selectedAsset}
      />
    </div>
  );
};
