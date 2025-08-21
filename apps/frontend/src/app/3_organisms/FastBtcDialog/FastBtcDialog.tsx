import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
  shouldHideSend?: boolean;
  step?: number;
};

export const FastBtcDialog: React.FC<FastBtcDialogProps> = ({
  isOpen,
  onClose,
  shouldHideSend = false,
  step = 0,
}) => {
  const [index, setIndex] = useState(step);
  const { account } = useAccount();

  const { isMobile } = useIsMobile();

  useEffect(() => {
    setIndex(step);
  }, [step]);

  const onChangeIndex = useCallback((index: number | null) => {
    index !== null ? setIndex(index) : setIndex(0);
  }, []);

  const items = useMemo(() => {
    if (shouldHideSend) {
      return [
        {
          label: t(translation.tabs.receiveLabel),
          infoText: t(translation.tabs.receiveInfoText),
          content: <ReceiveFlow onClose={onClose} />,
          activeClassName: ACTIVE_CLASSNAME,
          dataAttribute: 'funding-receive',
        },
      ];
    }

    return [
      {
        label: t(translation.tabs.receiveLabel),
        infoText: t(translation.tabs.receiveInfoText),
        content: <ReceiveFlow onClose={onClose} />,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'funding-receive',
      },
      {
        label: t(translation.tabs.sendLabel),
        infoText: t(translation.tabs.sendInfoText),
        content: <SendFlow onClose={onClose} />,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'funding-send',
      },
    ];
  }, [onClose, shouldHideSend]);

  const dialogSize = useMemo(
    () => (isMobile ? DialogSize.md : DialogSize.xl2),
    [isMobile],
  );

  // Reset the selected index to 0 in case the connected account changes because the new account may have the Send tab hidden and it would crash the app if we tried to access that index
  useEffect(() => {
    setIndex(0);
  }, [account]);

  return (
    <Dialog
      isOpen={isOpen}
      width={dialogSize}
      className="p-4 flex items-center sm:p-0"
      disableFocusTrap
      closeOnEscape={false}
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
        headerClassName="pb-0 pt-5"
        footerClassName="absolute bottom-5 left-5"
        contentClassName="px-10 pb-10 pt-6"
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
            dataAttribute="funding-close"
          />
        )}
      />
    </Dialog>
  );
};
