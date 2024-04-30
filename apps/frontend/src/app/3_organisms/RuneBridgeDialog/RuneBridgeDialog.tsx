import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  AddressBadge,
  Button,
  ButtonStyle,
  Dialog,
  DialogSize,
  Heading,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
  Tabs,
  VerticalTabs,
} from '@sovryn/ui';

import { MobileCloseButton } from '../../1_atoms/MobileCloseButton/MobileCloseButton';
import { useAccount } from '../../../hooks/useAccount';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { translations } from '../../../locales/i18n';
import { ReceiveFlow } from './components/ReceiveFlow/ReceiveFlow';
import { SendFlow } from './components/SendFlow/SendFlow';
import { ACTIVE_CLASSNAME } from './constants';
import { ReceiveFlowContextProvider } from './contextproviders/ReceiveFlowContext';
import { RuneContextProvider } from './contextproviders/RuneContextProvider';
import { SendFlowContextProvider } from './contextproviders/SendFlowContext';
import { useChainDetails } from './hooks/useChainDetails';

const translation = translations.runeBridge.mainScreen;

type RuneBridgeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  step?: number;
};

export const RuneBridgeDialog: React.FC<RuneBridgeDialogProps> = ({
  isOpen,
  onClose,
  step = 0,
}) => {
  const [index, setIndex] = useState(step);
  const { account } = useAccount();
  const { supported: isChainSupported, chainName } = useChainDetails();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    setIndex(step);
  }, [step]);

  const items = useMemo(() => {
    if (!isChainSupported) {
      return [
        {
          label: t(translation.tabs.unSupportedLabel, { chainName }),
          infoText: '',
          content: (
            <div className="mt-0 md:mt-12">
              <Paragraph
                size={ParagraphSize.base}
                style={ParagraphStyle.normal}
                children={`${chainName} is currently not supported by Rune bridge.`}
              />
            </div>
          ),
          activeClassName: ACTIVE_CLASSNAME,
          dataAttribute: 'funding-receive',
        },
      ];
    }
    return [
      {
        label: t(translation.tabs.receiveLabel),
        infoText: t(translation.tabs.receiveInfoText, { chainName }),
        content: (
          <ReceiveFlowContextProvider>
            <ReceiveFlow onClose={onClose} />
            <MobileCloseButton onClick={onClose} />
          </ReceiveFlowContextProvider>
        ),
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'funding-receive',
      },
      {
        label: t(translation.tabs.sendLabel),
        infoText: t(translation.tabs.sendInfoText, { chainName }),
        content: (
          <SendFlowContextProvider>
            <SendFlow onClose={onClose} />
            <MobileCloseButton onClick={onClose} />
          </SendFlowContextProvider>
        ),
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'funding-send',
      },
    ];
  }, [onClose, chainName, isChainSupported]);

  const onChangeIndex = useCallback((index: number | null) => {
    index !== null ? setIndex(index) : setIndex(0);
  }, []);

  const dialogSize = useMemo(
    () => (isMobile ? DialogSize.md : DialogSize.xl3),
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
      <RuneContextProvider>
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
          tabsClassName="min-h-[42rem] block pt-0 relative"
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
      </RuneContextProvider>
    </Dialog>
  );
};
