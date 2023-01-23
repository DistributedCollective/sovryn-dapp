import React, { useCallback, useState } from 'react';

import { t } from 'i18next';

import {
  AddressBadge,
  Button,
  ButtonStyle,
  Dialog,
  DialogSize,
  Heading,
  VerticalTabs,
  VerticalTabsItem,
} from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { ReceiveFlow } from './components/ReceiveFlow/ReceiveFlow';
import { SendFlow } from './components/SendFlow/SendFlow';

const translation = translations.fastBtc.mainScreen;

type FastBtcDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const FastBtcDialog: React.FC<FastBtcDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [index, setIndex] = useState(0);
  const { account } = useAccount();

  const onChangeIndex = useCallback((index: number | null) => {
    index !== null ? setIndex(index) : setIndex(0);
    //setIndexMobile(index);
  }, []);

  const items: VerticalTabsItem[] = [
    {
      label: t(translation.tabs.receiveLabel),
      infoText: t(translation.tabs.receiveInfoText),
      content: <ReceiveFlow onClose={onClose} />,
    },
    {
      label: t(translation.tabs.sendLabel),
      infoText: t(translation.tabs.sendInfoText),
      content: <SendFlow onClose={onClose} />,
    },
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} width={DialogSize.xl2}>
      <VerticalTabs
        items={items}
        onChange={onChangeIndex}
        selectedIndex={index}
        tabsClassName="min-h-[39rem] block pt-0 relative"
        headerClassName="pb-0"
        footerClassName="absolute bottom-5 left-5"
        contentClassName="p-10"
        header={() => (
          <>
            <div className="rounded bg-gray-60 px-2 py-1 w-fit mb-9">
              <AddressBadge address={account} />
            </div>
            <Heading className="mb-6">{t(translation.title)}</Heading>
          </>
        )}
        footer={() => (
          <Button
            text={t(translations.common.buttons.close)}
            onClick={onClose}
            style={ButtonStyle.ghost}
          />
        )}
      />
    </Dialog>
  );
};
