import React, { FC, PropsWithChildren } from 'react';

import blockies from 'ethereum-blockies';

import { prettyTx } from '../../../../../utils/helpers';

export type AddressBadgeProps = {
  address: string;
};

export const AddressBadge: FC<PropsWithChildren<AddressBadgeProps>> = ({
  address,
}) => {
  const getWalletAddrBlockieImg = (): string => {
    return blockies
      .create({
        // All options are optional
        seed: address, // seed used to generate icon data, default: random
        color: '#dfe', // to manually specify the icon color, default: random
        bgcolor: '#aaa', // choose a different background color, default: random
        size: 8, // width/height of the icon in blocks, default: 8
        scale: 3, // width/height of each block in pixels, default: 4
        spotcolor: '#000', // each pixel has a 13% chance of being of a third color,
      })
      .toDataURL();
  };

  return (
    <span className="flex flex-nowrap flex-row items-center w-full justify-between truncate font-semibold">
      <span>
        <img
          className="rounded-full mr-2"
          src={getWalletAddrBlockieImg()}
          alt="wallet address"
        />
      </span>
      <span>{prettyTx(address || '', 4, 4)}</span>
    </span>
  );
};
