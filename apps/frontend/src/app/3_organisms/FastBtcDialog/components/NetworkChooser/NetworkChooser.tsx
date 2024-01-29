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
import styles from './NetworkChooser.module.css';
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
          className={styles.item}
          icon={
            <div className={styles.icon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.6684 13.6612C20.1993 19.5541 14.2307 23.1404 8.33713 21.6709C2.44594 20.2017 -1.1404 14.2328 0.329471 8.34027C1.79797 2.44667 7.7665 -1.14001 13.6584 0.329174C19.5516 1.79836 23.1376 7.76792 21.6684 13.6612Z"
                  fill="#F7931A"
                />
                <path
                  d="M15.8486 9.43307C16.0676 7.96938 14.9531 7.18254 13.4293 6.65763L13.9236 4.67488L12.7167 4.3741L12.2354 6.3046C11.9182 6.22554 11.5923 6.15094 11.2685 6.07704L11.7532 4.13382L10.5469 3.83304L10.0523 5.8151C9.78966 5.75529 9.53185 5.69616 9.2816 5.63394L9.28298 5.62776L7.61854 5.21216L7.29748 6.50123C7.29748 6.50123 8.19295 6.70644 8.17404 6.71916C8.66285 6.84119 8.7512 7.16466 8.73641 7.4211L8.17335 9.67988C8.20704 9.68848 8.25069 9.70085 8.29882 9.7201C8.2586 9.71013 8.21563 9.69913 8.17129 9.68848L7.38204 12.8527C7.32223 13.0012 7.17063 13.2239 6.82895 13.1394C6.84098 13.1569 5.9517 12.9204 5.9517 12.9204L5.35254 14.3019L6.92313 14.6935C7.21532 14.7667 7.50166 14.8434 7.78354 14.9155L7.28407 16.921L8.4896 17.2218L8.98426 15.2376C9.31357 15.327 9.63326 15.4095 9.94607 15.4872L9.45313 17.462L10.66 17.7628L11.1595 15.7612C13.2175 16.1506 14.7651 15.9935 15.4165 14.1321C15.9414 12.6334 15.3904 11.7689 14.3076 11.2051C15.0961 11.0233 15.6901 10.5045 15.8486 9.43307ZM13.091 13.2999C12.7181 14.7987 10.1946 13.9884 9.37648 13.7853L10.0392 11.1284C10.8574 11.3326 13.4809 11.7369 13.091 13.2999ZM13.4644 9.41141C13.124 10.7747 11.0237 10.0821 10.3424 9.91226L10.9433 7.50257C11.6246 7.67238 13.8188 7.98932 13.4644 9.41141Z"
                  fill="white"
                />
              </svg>
            </div>
          }
        />
        <WalletContainer
          name={t(translations.fastBtc.networkChooser.networks.lightning)}
          onClick={handleNetworkChange(Network.lightning)}
          className={styles.item}
          icon={
            <div className={styles.icon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z"
                  fill="#7B1AF7"
                />
                <path
                  d="M5.82594 11.3561L13.9362 4.36741C14.2896 4.14109 14.6265 4.36741 14.4108 4.75567L11.8224 9.84618H16.4383C16.4383 9.84618 17.1717 9.84618 16.4383 10.4501L8.45747 17.4819C7.89666 17.9564 7.5084 17.6976 7.89666 16.9642L10.3988 12.0032H5.82594C5.82594 12.0032 5.09257 12.0032 5.82594 11.3561Z"
                  fill="white"
                />
              </svg>
            </div>
          }
        />

        <MobileCloseButton
          onClick={onClose}
          dataAttribute={`network-chooser-${
            isReceiveDirection ? 'receive' : 'send'
          }-close`}
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
