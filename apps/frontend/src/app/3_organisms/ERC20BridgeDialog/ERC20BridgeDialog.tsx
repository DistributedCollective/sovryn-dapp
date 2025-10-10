import { QueryClientProvider } from '@tanstack/react-query';

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

import { MobileCloseButton } from '../../1_atoms/MobileCloseButton/MobileCloseButton';
import { useAccount } from '../../../hooks/useAccount';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { translations } from '../../../locales/i18n';
import { ACTIVE_CLASSNAME, queryClient } from './ERC20BridgeDialog.constants';
import { ReceiveFlow } from './components/ReceiveFlow/ReceiveFlow';
import { SendFlow } from './components/SendFlow/SendFlow';
import { ReceiveFlowContextProvider } from './contextproviders/ReceiveFlowContext';
import { SendFlowContextProvider } from './contextproviders/SendFlowContext';

const translation = translations.erc20Bridge.mainScreen;

type ERC20BridgeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  step?: number;
};

export const ERC20BridgeDialog: React.FC<ERC20BridgeDialogProps> = ({
  isOpen,
  onClose,
  step = 0,
}) => {
  const [index, setIndex] = useState(step);
  const { account } = useAccount();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    setIndex(step);
  }, [step]);

  const items = useMemo(() => {
    return [
      {
        label: t(translation.tabs.receiveLabel),
        infoText: t(translation.tabs.receiveInfoText),
        content: (
          <ReceiveFlowContextProvider>
            <ReceiveFlow onClose={onClose} />
            <MobileCloseButton onClick={onClose} />
          </ReceiveFlowContextProvider>
        ),
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'erc20-bridge-receive',
      },
      {
        label: t(translation.tabs.sendLabel),
        infoText: t(translation.tabs.sendInfoText),
        content: (
          <SendFlowContextProvider>
            <SendFlow onClose={onClose} />
            <MobileCloseButton onClick={onClose} />
          </SendFlowContextProvider>
        ),
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'erc20-bridge-send',
      },
    ];
  }, [onClose]);

  const onChangeIndex = useCallback((index: number | null) => {
    index !== null ? setIndex(index) : setIndex(0);
  }, []);

  const dialogSize = useMemo(
    () => (isMobile ? DialogSize.md : DialogSize.xl3),
    [isMobile],
  );

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
      <QueryClientProvider client={queryClient}>
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
          tabsClassName="min-h-[42rem] h-auto self-stretch block pt-0 relative flex-1"
          headerClassName="pb-0 pt-5"
          footerClassName="absolute bottom-5 left-5"
          contentClassName="px-9 pb-10 pt-6 flex-1"
          className="hidden md:flex"
          header={() => (
            <>
              <div className="rounded bg-gray-60 px-2 py-1 w-fit mb-9">
                <AddressBadge address={account} />
              </div>
              <Heading className="mb-20">{t(translation.title)}</Heading>
            </>
          )}
          footer={() => (
            <Button
              text={t(translations.common.buttons.close)}
              onClick={onClose}
              style={ButtonStyle.ghost}
              dataAttribute="erc20-bridge-close"
            />
          )}
        />
      </QueryClientProvider>
    </Dialog>
  );
};
