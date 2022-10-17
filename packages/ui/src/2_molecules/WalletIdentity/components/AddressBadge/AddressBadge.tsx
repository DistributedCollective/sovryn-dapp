import React, { FC } from 'react';

import blockies from 'ethereum-blockies';

import { prettyTx } from '../../../../utils';
import styles from './AddressBadge.module.css';

export type AddressBadgeProps = {
  address: string;
  startLength?: number;
  endLength?: number;
  dataLayoutId?: string;
};

export const AddressBadge: FC<AddressBadgeProps> = ({
  address,
  startLength = 4,
  endLength = 4,
  dataLayoutId,
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
    <span className={styles.addressBadge}>
      <span>
        <img
          className={styles.walletLogo}
          src={getWalletAddrBlockieImg()}
          alt="wallet address"
        />
      </span>
      <span data-layout-id={dataLayoutId}>
        {prettyTx(address || '', startLength, endLength)}
      </span>
    </span>
  );
};
