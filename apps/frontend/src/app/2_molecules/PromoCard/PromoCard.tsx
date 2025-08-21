import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { SupportedTokens } from '@sovryn/contracts';

import { AssetPairRenderer } from '../AssetPairRenderer/AssetPairRenderer';
import styles from './PromoCard.module.css';

type PromoCardProps = {
  className?: string;
  asset1: SupportedTokens;
  asset2: SupportedTokens;
  label1: string;
  child1: ReactNode;
  label2: string;
  child2: ReactNode;
  onClick?: () => void;
};

export const PromoCard: FC<PromoCardProps> = ({
  className,
  asset1,
  asset2,
  label1,
  child1,
  label2,
  child2,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={classNames(styles.wrapper, className, {
      'cursor-pointer': !!onClick,
    })}
  >
    <AssetPairRenderer className="mb-3" asset1={asset1} asset2={asset2} />

    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-gray-30 mb-1.5">{label1}</span>
        <span className="text-white text-base">{child1}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-gray-30 mb-1.5">{label2}</span>
        <span className="text-white text-base">{child2}</span>
      </div>
    </div>
  </div>
);
