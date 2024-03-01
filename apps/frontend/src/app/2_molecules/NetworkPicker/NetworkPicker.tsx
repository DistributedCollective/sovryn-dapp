import React, { useMemo } from 'react';

import { Dropdown, Menu, MenuItem } from '@sovryn/ui';

import { chains } from '../../../config/chains';

import { useChainStore } from '../../../hooks/useChainStore';

export const NetworkPicker = () => {
  const { currentChainId, setCurrentChainId } = useChainStore();
  const selectedChain = useMemo(
    () => chains.find(chain => chain.id === currentChainId),
    [currentChainId],
  );
  return (
    <Dropdown
      text={
        <>
          <img
            src={selectedChain?.icon}
            className="w-8 h-8"
            alt={selectedChain?.label}
          />
        </>
      }
      closeOnClick
      className="h-8"
    >
      <Menu>
        {chains.map(item => (
          <MenuItem
            key={item.id}
            text={
              <span className="flex flex-row gap-4 items-center">
                <img src={item.icon} className="w-8 h-8" alt={item.label} />{' '}
                {item.label}
              </span>
            }
            isActive={item.id === currentChainId}
            onClick={setCurrentChainId.bind(null, item.id)}
          />
        ))}
      </Menu>
    </Dropdown>
  );
};
