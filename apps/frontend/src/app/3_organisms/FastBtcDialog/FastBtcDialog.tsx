import React, { useCallback, useState } from 'react';

import {
  Button,
  Dialog,
  DialogSize,
  Heading,
  VerticalTabs,
  VerticalTabsItem,
} from '@sovryn/ui';

import { ReceiveFlow } from './components/ReceiveFlow/ReceiveFlow';
import { SendFlow } from './components/SendFlow/SendFlow';

type FastBtcDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const FastBtcDialog: React.FC<FastBtcDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [index, setIndex] = useState(0);

  const onChangeIndex = useCallback((index: number | null) => {
    index !== null ? setIndex(index) : setIndex(0);
    //setIndexMobile(index);
  }, []);

  const items: VerticalTabsItem[] = [
    {
      label: 'Receive',
      infoText:
        'Transfer BTC from the bitcoin network to your Rootstock address',
      content: <ReceiveFlow onClose={onClose} />,
    },
    {
      label: 'Send',
      infoText:
        'Transfer BTC from the Rootstock network to a specified bitcoin address',
      content: <SendFlow onClose={onClose} />,
    },
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} width={DialogSize.xl2}>
      <VerticalTabs
        items={items}
        onChange={onChangeIndex}
        selectedIndex={index}
        tabsClassName="min-h-[36rem]"
        header={() => (
          <>
            <Heading>Funding</Heading>
          </>
        )}
        footer={() => <Button text="Close" onClick={onClose} />}
      />
    </Dialog>
  );
};
