import React, { useMemo } from 'react';

import { Dropdown, Menu, MenuItem } from '@sovryn/ui';

import { chains } from '../../../config/chains';

import { useChainStore } from '../../../hooks/useChainStore';

export const NetworkPicker = () => {
  const { currentChainId, setCurrentChainId } = useChainStore();
  const selectedChainName = useMemo(
    () => chains.find(chain => chain.id === currentChainId)?.label,
    [currentChainId],
  );
  return (
    <Dropdown text={selectedChainName} closeOnClick className="h-8">
      <Menu>
        {chains.map(item => (
          <MenuItem
            key={item.id}
            text={item.label}
            isActive={item.id === currentChainId}
            onClick={setCurrentChainId.bind(null, item.id)}
          />
        ))}
      </Menu>
    </Dropdown>
  );
};
