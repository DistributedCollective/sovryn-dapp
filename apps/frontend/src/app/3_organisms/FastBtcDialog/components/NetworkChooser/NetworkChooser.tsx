import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { Heading, HeadingType, WalletContainer } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { Network, useFastBtcDialogStore } from '../../store';
import { BoltzSendFlow } from '../BoltzSendFlow/BoltzSendFlow';
import { ReceiveFlow } from '../ReceiveFlow/ReceiveFlow';
import { SendFlow } from '../SendFlow/SendFlow';

export enum Direction {
  Receive,
  Send,
}

type NetworkChooserProps = {
  direction: Direction;
  onClose: () => void;
};

export const NetworkChooser: FC<NetworkChooserProps> = ({
  direction,
  onClose,
}) => {
  const network = useFastBtcDialogStore(state => state.network);
  const setNetwork = useFastBtcDialogStore(state => state.set);

  const handleNetworkChange = useCallback(
    (network: Network) => () => setNetwork(network),
    [setNetwork],
  );

  if (network === Network.none) {
    return (
      <div className="flex flex-col gap-y-3 text-center">
        <Heading type={HeadingType.h2} className="font-medium mb-8">
          {t(
            translations.fastBtc.networkChooser[
              direction === Direction.Receive ? 'receive' : 'send'
            ].title,
          )}
        </Heading>
        <WalletContainer
          name={t(translations.fastBtc.networkChooser.networks.bitcoin)}
          onClick={handleNetworkChange(Network.bitcoin)}
        />
        <WalletContainer
          name={t(translations.fastBtc.networkChooser.networks.lightning)}
          onClick={handleNetworkChange(Network.lightning)}
        />
      </div>
    );
  }

  return (
    <>
      {direction === Direction.Receive && (
        <>
          {network === Network.bitcoin && <ReceiveFlow onClose={onClose} />}
          {network === Network.lightning && <p>Add receive flow component</p>}
        </>
      )}
      {direction === Direction.Send && (
        <>
          {network === Network.bitcoin && <SendFlow onClose={onClose} />}
          {network === Network.lightning && <BoltzSendFlow onClose={onClose} />}
        </>
      )}
    </>
  );
};
