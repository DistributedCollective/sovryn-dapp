import React, { useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  AddressBadge,
  Button,
  ButtonStyle,
  Dialog,
  DialogSize,
  Heading,
  Tabs,
  VerticalTabs,
} from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { translations } from '../../../locales/i18n';
import { ReceiveFlow } from './components/ReceiveFlow/ReceiveFlow';
import { SendFlow } from './components/SendFlow/SendFlow';

const ACTIVE_CLASSNAME = 'border-t-primary-30';

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

  const { isMobile } = useIsMobile();

  const onChangeIndex = useCallback((index: number | null) => {
    index !== null ? setIndex(index) : setIndex(0);
  }, []);

  const items = useMemo(
    () => [
      {
        label: t(translation.tabs.receiveLabel),
        infoText: t(translation.tabs.receiveInfoText),
        content: <ReceiveFlow onClose={onClose} />,
        activeClassName: ACTIVE_CLASSNAME,
      },
      {
        label: t(translation.tabs.sendLabel),
        infoText: t(translation.tabs.sendInfoText),
        content: <SendFlow onClose={onClose} />,
        activeClassName: ACTIVE_CLASSNAME,
      },
    ],
    [onClose],
  );

  const dialogSize = useMemo(
    () => (isMobile ? DialogSize.md : DialogSize.xl2),
    [isMobile],
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      width={dialogSize}
      className="p-4 flex items-center sm:p-0"
      disableFocusTrap
    >
      <Tabs
        index={index}
        items={items}
        onChange={onChangeIndex}
        className="w-full md:hidden"
        contentClassName="pt-9 px-6 pb-7 h-full"
      />
      <VerticalTabs
        items={items}
        onChange={onChangeIndex}
        selectedIndex={index}
        tabsClassName="min-h-[39rem] block pt-0 relative"
        headerClassName="pb-0"
        footerClassName="absolute bottom-5 left-5"
        contentClassName="p-10"
        className="hidden md:flex"
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
