import React, { useMemo } from 'react';

import { Dropdown, Menu, MenuItem } from '@sovryn/ui';

import { APP_CHAIN_LIST } from '../../../config/chains';

import { useChainStore } from '../../../hooks/useChainStore';
import { getChainById } from '../../../utils/chain';
import styles from './NetworkPicker.module.css';

export const NetworkPicker = () => {
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
      className="h-8 min-w-0"
      dropdownClassName="z-[10000000]"
    >
      <Menu>
        {APP_CHAIN_LIST.map(item => (
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
