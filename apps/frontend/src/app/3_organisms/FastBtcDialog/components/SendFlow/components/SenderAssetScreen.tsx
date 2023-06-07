import React, { useCallback, useContext } from 'react';

import { t } from 'i18next';

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
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';

const translation = translations.fastBtc.send.senderScreen;

export const SenderAssetScreen: React.FC = () => {
  const { set } = useContext(WithdrawContext);
  // const [selectedAsset, setSelectedAsset] = useState<SupportedTokens>();
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
          dataAttribute={`funding-send-transaction-id`}
        />
      ),
    },
    {
      id: 'balance',
      title: t(translation.table.balance),
      align: Align.right,
      cellRenderer: row => `${row.balance} ${row.asset.toUpperCase()}`,
    },
  ];

  const rows = [
    {
      asset: 'BNB',
      address: '0x1234567890123456789012345678901234567890',
      balance: 0.2,
    },
    {
      asset: 'DLLR',
      address: '0x0p42490ACCbc50F4F9c130b5876521I1q7b3C0p',
      balance: 1.234,
    },
    {
      asset: 'ETH',
      address: '0x6p42490ACCbc50F4F9c130b5876521I1q7b3C0p',
      balance: 4,
    },
  ];

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: WithdrawStep.NETWORK })),
    [set],
  );

  // const onRowClick = useCallback(row => setSelectedAsset(row.asset), []);

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translation.title)}
      </Heading>

      <TableBase
        columns={columns}
        rows={rows}
        dataAttribute="sender-asset-table"
        // onRowClick={onRowClick}
        isClickable
      />

      <Button
        onClick={onContinueClick}
        text={t(translations.common.buttons.continue)}
        className="w-full mt-8"
        style={ButtonStyle.secondary}
        dataAttribute="funding-send-sender-asset"
      />
    </div>
  );
};
