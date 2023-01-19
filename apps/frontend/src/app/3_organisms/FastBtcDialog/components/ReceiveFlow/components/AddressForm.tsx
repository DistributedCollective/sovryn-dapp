import React, { useCallback, useContext, useMemo } from 'react';

import QRCode from 'qrcode.react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@sovryn/tailwindcss-config';
import { prettyTx, Icon, IconNames } from '@sovryn/ui';

import { DepositContext } from '../../../contexts/deposit-context';
import { URIType } from '../../../types';

const config = resolveConfig(tailwindConfig);

export const AddressForm: React.FC = () => {
  const { address } = useContext(DepositContext);

  const formattedAddress = useMemo(() => prettyTx(address, 12, 12), [address]);

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    alert('Address was copied to clipboard.');
  }, [address]);

  return (
    <>
      <div className="full mb-8">
        <div>
          <div className="h-full bg-white rounded">
            <QRCode
              value={`${URIType.BITCOIN}${address}`}
              renderAs="svg"
              bgColor="white"
              fgColor={config?.theme?.colors?.['gray-80'] || 'black'}
              includeMargin={false}
              className="rounded"
            />
          </div>

          <div className="flex">
            <div>{formattedAddress}</div>

            <span
              className="ml-1 cursor-pointer hover:bg-gray-20 p-1 rounded text-gray-50"
              onClick={copyAddress}
            >
              <Icon icon={IconNames.COPY} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
