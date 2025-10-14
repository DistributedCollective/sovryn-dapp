import React, { FC, useMemo } from 'react';

import classNames from 'classnames';

import { Dropdown, Menu, MenuItem } from '@sovryn/ui';

import { APP_CHAIN_LIST } from '../../../config/chains';

import { useChainStore } from '../../../hooks/useChainStore';
import { getChainById } from '../../../utils/chain';
import styles from './NetworkPicker.module.css';

type NetworkPickerProps = {
  className?: string;
};
export const NetworkPicker: FC<NetworkPickerProps> = ({ className }) => {
  const { currentChainId, setCurrentChainId } = useChainStore();
  const selectedChain = useMemo(
    () => getChainById(currentChainId),
    [currentChainId],
  );
  return (
    <Dropdown
      text={
        <>
          <img
            src={selectedChain?.icon}
            className="w-5 h-5 opacity-50"
            alt={selectedChain?.label}
          />
        </>
      }
      closeOnClick
      className={classNames('h-8 min-w-0', className)}
      dropdownClassName="z-[10000000]"
    >
      <Menu>
        {APP_CHAIN_LIST.filter(item => item.isVisible).map(item => (
          <MenuItem
            key={item.id}
            text={
              <span className={styles.itemContent}>
                <img src={item.icon} className={styles.icon} alt={item.label} />{' '}
                {item.label}
              </span>
            }
            isActive={item.id === currentChainId}
            onClick={setCurrentChainId.bind(null, item.id)}
            className={styles.menuItem}
          />
        ))}
      </Menu>
    </Dropdown>
  );
};
