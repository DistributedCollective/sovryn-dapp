import React, { FC, useEffect } from 'react';

import { getAssetData } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

type AssetIconProps = {
  symbol: string;
  chainId: ChainId;
  className?: string;
  size?: number;
};

export const AssetIcon: FC<AssetIconProps> = ({
  symbol,
  chainId,
  className,
  size = 24,
}) => {
  const [tokenLogo, setTokenLogo] = React.useState<string>();

  useEffect(() => {
    getAssetData(symbol, chainId).then(data => {
      setTokenLogo(data.icon);
    });
  }, [symbol, chainId]);

  if (!tokenLogo) {
    return (
      <div
        style={{ width: size, height: size }}
        className="text-gray-50 rounded-full bg-gray-30 grid place-items-center"
      >
        {symbol.slice(0, 1).toUpperCase()}
      </div>
    );
  }
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: tokenLogo }}
    />
  );
};
