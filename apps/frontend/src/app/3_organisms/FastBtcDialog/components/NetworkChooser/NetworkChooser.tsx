import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Heading, HeadingType, WalletContainer } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { Network, useFastBtcDialogStore } from '../../store';
import { BoltzReceiveFlow } from '../BoltzReceiveFlow/BoltzReceiveFlow';
import { BoltzSendFlow } from '../BoltzSendFlow/BoltzSendFlow';
import { MobileCloseButton } from '../MobileCloseButton';
import { ReceiveFlow } from '../ReceiveFlow/ReceiveFlow';
import { SendFlow } from '../SendFlow/SendFlow';
import { Direction } from './NetworkChooser.type';

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

  const isReceiveDirection = useMemo(
    () => direction === Direction.Receive,
    [direction],
  );

  if (network === Network.none) {
    return (
      <div className="flex flex-col gap-y-3 text-center">
        <Heading type={HeadingType.h2} className="font-medium mb-8">
          {t(
            translations.fastBtc.networkChooser[
              isReceiveDirection ? 'receive' : 'send'
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

        <MobileCloseButton
          onClick={onClose}
          dataAttribute={`network-chooser-${
            isReceiveDirection ? 'receive' : 'send'
          }-close`}
        />
      </div>
    );
  }

  return (
    <>
      {isReceiveDirection && (
        <>
          {network === Network.bitcoin && <ReceiveFlow onClose={onClose} />}
          {network === Network.lightning && (
            <BoltzReceiveFlow onClose={onClose} />
          )}
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
