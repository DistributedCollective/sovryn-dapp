import React from 'react';

import {
  Align,
  ButtonStyle,
  InputSize,
  RowObject,
  Button,
  FormGroup,
  Heading,
  Input,
  TransactionId,
  Select,
  TableBase,
} from '@sovryn/ui';

import { useContractServices } from '../../hooks/useContractServices';

interface RuneToRSKProps {
  onClose: () => void;
}

export const RuneToRSK: React.FC<RuneToRSKProps> = ({ onClose }) => {
  const { requestDepositAddress, depositAddress, tokenBalances } =
    useContractServices();
  console.log('tokenBalances', tokenBalances);
  const options = tokenBalances.map(tokenBalance => {
    return {
      label: tokenBalance.name,
      value: tokenBalance.tokenContractAddress,
    };
  });

  const rows: RowObject[] = tokenBalances.map((tokenBalance, index) => {
    return {
      address: (
        <TransactionId
          href={`https://explorer.testnet.rsk.co/address/${tokenBalance.tokenContractAddress}`}
          value={tokenBalance.tokenContractAddress}
        />
      ),
      balance: `${tokenBalance.balance} ${tokenBalance.symbol}`,
      name: tokenBalance.name,
    };
  });
  return (
    <div className="flex flex-col">
      <FormGroup>
        <Heading>Rune to RSK</Heading>
        <Select onChange={() => {}} options={options} value="1" />
        <Button
          onClick={requestDepositAddress}
          style={ButtonStyle.secondary}
          text="Generate deposit address"
        />
        <Input
          onChangeText={() => {}}
          size={InputSize.small}
          type="text"
          label="deposit address"
          value={depositAddress}
          disabled={true}
          readOnly={true}
        />
      </FormGroup>
      <div className="">
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
