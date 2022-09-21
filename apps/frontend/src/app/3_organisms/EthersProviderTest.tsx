import { Chain, getProvider } from '@sovryn/ethers-provider';
import React, { useEffect, useState } from 'react';
import { network } from '../../utils/network';

const ProviderItem = ({ chain }: { chain: Chain }) => {
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const provider = getProvider(chain.id);
    provider.on('block', (blockNumber: number) => {
      setBlockNumber(blockNumber);
      setDate(new Date());
      setCount(value => value + 1);
    });
    return () => {
      provider.removeAllListeners('block');
    };
  }, [chain.id]);

  return (
    <div>
      <h2>
        {chain.label} [{chain.id}]
      </h2>
      <p>BlockNumber: {blockNumber}</p>
      <p>Synced At: {date.toISOString()}</p>
      <p>Times updated: {count}</p>
    </div>
  );
};

export const EthersProviderTest = () => {
  return (
    <div>
      <hr />
      <h1>Block Id by network.</h1>
      <ul>
        {network.chains().map(b => (
          <ProviderItem key={b.id} chain={b} />
        ))}
      </ul>
    </div>
  );
};
