import React, { FC, PropsWithChildren } from 'react';

import blockies from 'ethereum-blockies';

import { Dropdown } from '@sovryn/ui';
import { DropdownSize } from '@sovryn/ui/src/2_molecules/Dropdown/Dropdown.types';

import { prettyTx } from '../../../utils/helpers';
import styles from './WalletIdentity.module.css';
import { DisconnectSubmenu } from './components/DisconnectSubmenu/DisconnectSubmenu';

export type WalletIdentityProps = {
  onDisconnect: () => void;
  address: string;
  className?: string;
  dataActionId?: string;
  hideSubmenu?: boolean;
};

export const WalletIdentity: FC<PropsWithChildren<WalletIdentityProps>> = ({
  address,
  onDisconnect,
  className,
  hideSubmenu = false,
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

  const AddressBadge = (
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

  if (hideSubmenu) {
    return <div className={styles['address-badge']}>{AddressBadge}</div>;
  }

  return (
    <Dropdown className={'w-40'} text={AddressBadge} size={DropdownSize.small}>
      <DisconnectSubmenu onDisconnect={onDisconnect} address={address} />
    </Dropdown>
  );
};
