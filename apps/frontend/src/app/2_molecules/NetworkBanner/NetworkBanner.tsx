import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';
import { Icon, IconNames, Paragraph } from '@sovryn/ui';

import { useRequiredChain } from './hooks/useRequiredChain';

type NetworkBannerProps = {
  requiredChainId: ChainId;
  className?: string;
};

export const NetworkBanner: FC<NetworkBannerProps> = ({
  requiredChainId,
  className,
}) => {
  const { requiredChain, invalidChain, updateChain } =
    useRequiredChain(requiredChainId);

  if (!invalidChain) {
    return null;
  }

  return (
    <div
      onClick={updateChain}
      className={classNames(
        'mx-auto w-full text-center cursor-pointer rounded-lg mb-2',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row justify-center items-center bg-white font-bold text-sovryn-black p-4">
        <div className="flex flex-row items-center text-left sm:text-center mb-2 sm:mb-0">
          <div className="text-primary-75">
            <Icon icon={IconNames.WARNING} size={18} />
          </div>
          <div className="ml-2">
            <Paragraph>
              {t('networkBanner.content', { network: requiredChain?.label })}
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};
