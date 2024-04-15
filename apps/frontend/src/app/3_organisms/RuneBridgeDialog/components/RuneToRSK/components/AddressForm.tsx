import React, { useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode.react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@sovryn/tailwindcss-config';
import {
  Align,
  RowObject,
  TransactionId,
  TableBase,
  applyDataAttr,
  Icon,
  IconNames,
  NotificationType,
  prettyTx,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../../../../contexts/NotificationContext';
import { translations } from '../../../../../../locales/i18n';
import {
  Environments,
  ExplorerNetworkURI,
} from '../../../../../../types/global';
import { useValidateFederators } from '../../../../FastBtcDialog/hooks/useValidateFederators';
import { URIType } from '../../../../FastBtcDialog/types';
import { useContractService } from '../../../hooks/useContractService';
import { Limits } from '../../Limits';

const config = resolveConfig(tailwindConfig);

export const AddressForm = () => {
  const { depositAddress, tokenBalances } = useContractService();
  const { isSignatureValid, loading } = useValidateFederators();
  const { addNotification } = useNotificationContext();
  const hasValidationBeenUnsuccessful = useMemo(
    () => !loading && !isSignatureValid,
    [isSignatureValid, loading],
  );

  const formattedDepositAddress = useMemo(
    () => prettyTx(depositAddress, 20, 20),
    [depositAddress],
  );

  const explorerNetworkURI =
    process.env.REACT_APP_NETWORK === Environments.Testnet
      ? ExplorerNetworkURI.Testnet
      : ExplorerNetworkURI.Mainnet;
  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(depositAddress);

    addNotification({
      type: NotificationType.success,
      title: t(translations.fastBtc.addressForm.copyAddressSuccess),
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification, depositAddress]);

  const rows: RowObject[] = tokenBalances.map((tokenBalance, index) => {
    return {
      address: (
        <TransactionId
          href={`${explorerNetworkURI}/address/${tokenBalance.tokenContractAddress}`}
          value={tokenBalance.tokenContractAddress}
        />
      ),
      balance: `${tokenBalance.balance} ${tokenBalance.symbol}`,
      name: tokenBalance.name,
    };
  });
  return (
    <div className="full">
      <Limits
        minimumAmount="No limit"
        maximumAmount="No limit"
        serviceFee="Free"
        className="mb-6"
      />

      <div className="bg-gray-80 border rounded border-gray-50  text-xs relative">
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
              value={`${URIType.BITCOIN}${depositAddress}`}
              renderAs="svg"
              bgColor="white"
              fgColor={config?.theme?.colors?.['gray-80'] || 'black'}
              includeMargin={false}
              className="rounded w-36 h-36"
            />
          </div>

          <div className="flex justify-between mt-5 items-center bg-gray-70 border rounded border-gray-50 py-2 pl-3 pr-2 text-gray-30">
            <div>{formattedDepositAddress}</div>

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

      <div className="mt-2">
        <TableBase
          columns={[
            {
              align: Align.left,
              id: 'name',
              title: 'Name',
            },
            {
              align: Align.left,
              id: 'address',
              title: 'Address',
            },
            {
              align: Align.left,
              id: 'balance',
              title: 'Balance',
            },
          ]}
          dataAttribute="addressTable"
          onRowClick={() => {}}
          rowKey={row => row.name}
          rows={rows}
        />
      </div>
    </div>
  );
};
