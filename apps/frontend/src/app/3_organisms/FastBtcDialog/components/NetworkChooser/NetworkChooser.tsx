import { Button } from '@sovryn/ui';
import React, { FC } from 'react';
import { ReceiveFlow } from '../ReceiveFlow/ReceiveFlow';
import { SendFlow } from '../SendFlow/SendFlow';
import { Network, useFastBtcDialogStore } from '../../store';

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

  if (network === Network.none) {
    return (
      <>
        <Button text="Bitcoin" onClick={() => setNetwork(Network.bitcoin)} />
        <Button
          text="Lightning"
          onClick={() => setNetwork(Network.lightning)}
        />
      </>
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
          {network === Network.lightning && <p>Add send flow component here</p>}
        </>
      )}
    </>
  );
};
