import React, { FC } from 'react';

import { Button } from '@sovryn/ui';

import { useWalletConnect } from '../../../hooks';

type ConnectWalletMessageProps = {
  text: string;
  ctaText: string;
};

export const ConnectWalletMessage: FC<ConnectWalletMessageProps> = ({
  text,
  ctaText,
}) => {
  const { connectWallet } = useWalletConnect();

  return (
    <div className="flex items-center justify-center bg-gray-70 lg:bg-gray-90 px-2.5 py-3 lg:p-0 rounded">
      <div className="text-xs font-medium italic mr-4">{text}</div>
      <Button
        text={ctaText}
        onClick={connectWallet}
        className="text-sm font-medium"
      />
    </div>
  );
};
