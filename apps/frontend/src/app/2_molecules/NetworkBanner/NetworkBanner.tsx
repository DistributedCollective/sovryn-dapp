import React, { FC, ReactNode, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';
import { Icon, IconNames, Paragraph } from '@sovryn/ui';

import { useRequiredChain } from '../../../hooks/chain/useRequiredChain';
import { useChainStore } from '../../../hooks/useChainStore';
import { getChainLabel } from '../../../utils/chain';

type NetworkBannerProps = {
  requiredChainId: ChainId;
  className?: string;
  outerClassName?: string;
  childClassName?: string;
  children?: ReactNode;
};

export const NetworkBanner: FC<NetworkBannerProps> = ({
  requiredChainId,
  outerClassName,
  className,
  childClassName,
  children,
}) => {
  const { requiredChain, invalidChain, updateChain } =
    useRequiredChain(requiredChainId);
  const { currentChainId } = useChainStore();
  const currentChainLabel = useMemo(
    () => getChainLabel(currentChainId),
    [currentChainId],
  );
  if (!invalidChain) {
    return children ? <>{children}</> : null;
  }

  return (
    <div className={classNames(outerClassName)}>
      <div
        onClick={updateChain}
        className={classNames(
          'mx-auto w-full text-center cursor-pointer mb-4',
          className,
        )}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center bg-gray-60 rounded-lg text-white p-4">
          <div className="flex flex-row items-center text-left sm:text-center">
            <div>
              <Icon icon={IconNames.INFO} size={18} />
            </div>
            <div className="ml-2 text-center">
              <Paragraph>
                {t('networkBanner.content', {
                  currentNetwork: currentChainLabel,
                  network: requiredChain?.label,
                })}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
      <div
        className={classNames('relative pointer-events-none', childClassName)}
      >
        <div
          className="bg-cover absolute w-full h-full left-0 top-0 opacity-75 z-[1]"
          style={{
            //1px image of sovryn-black #0D0D0F - elements with partial opacity will remain visible unless we use this method of overlay
            backgroundImage:
              'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY+DjEwAAAFoALW5W2PAAAAAASUVORK5CYII=)',
          }}
        ></div>

        {children}
      </div>
    </div>
  );
};
