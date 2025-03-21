import { SatsConnector } from '@gobob/sats-wagmi';

import BinanceIcon from '../../../../../assets/images/BitcoinWallets/Binance.svg';
import LeatherIcon from '../../../../../assets/images/BitcoinWallets/Leather.svg';
import MetaMaskIcon from '../../../../../assets/images/BitcoinWallets/MetaMask.svg';
import UniSetIcon from '../../../../../assets/images/BitcoinWallets/UniSet.svg';
import XversIcon from '../../../../../assets/images/BitcoinWallets/Xvers.svg';

export const getBitcoinWalletIcon = (connector: SatsConnector) => {
  if (connector.icon) {
    return connector.icon;
  }

  switch (connector.id) {
    case 'xverse':
      return XversIcon;
    case 'unisat':
      return UniSetIcon;
    case 'binancew3w':
      return BinanceIcon;
    case 'metamask_snap':
      return MetaMaskIcon;
    case 'leather':
      return LeatherIcon;
  }
};
