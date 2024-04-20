import React, { FC, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
import { reactLocalStorage } from 'reactjs-localstorage';

import { ChainId } from '@sovryn/ethers-provider';
import { Icon, IconNames } from '@sovryn/ui';

import { useRequiredChain } from '../../../hooks/chain/useRequiredChain';
import { getChainLabel } from '../../../utils/chain';

type MarketMakingNetworkBannerProps = {
  requiredChainId: ChainId;
  storageKey: string;
  active?: boolean;
  className?: string;
  outerClassName?: string;
};

export const MarketMakingNetworkBanner: FC<MarketMakingNetworkBannerProps> = ({
  requiredChainId,
  outerClassName,
  className,
  storageKey,
}) => {
  const { updateChain } = useRequiredChain(requiredChainId);
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => {
    setDismissed(reactLocalStorage.get(storageKey) === 'true' || false);
  }, [storageKey]);

  const dismiss = useCallback(
    evt => {
      evt.stopPropagation();
      reactLocalStorage.set(storageKey, 'true');
      setDismissed(true);
    },
    [storageKey],
  );

  if (dismissed) return null;

  return (
    <div className={classNames(outerClassName)}>
      <div
        onClick={updateChain}
        className={classNames(
          'mx-auto w-full text-center cursor-pointer mb-4',
          className,
        )}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center bg-gray-60 rounded-lg text-white px-4 py-2">
          <div className="flex flex-row items-center w-full text-left sm:text-center">
            <div className="grow">
              <div className="flex items-center justify-center">
                <div>
                  <Icon icon={IconNames.INFO} size={18} />
                </div>
                <div className="ml-2 text-center text-sm">
                  <Trans
                    i18nKey={t('marketMakingNetworkBanner.content')}
                    values={{ network: getChainLabel(requiredChainId) }}
                    components={[
                      <span className="underline text-primary-75">
                        switching to
                      </span>,
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="cursor-pointer" onClick={dismiss}>
              <Icon icon={IconNames.X_MARK} className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
