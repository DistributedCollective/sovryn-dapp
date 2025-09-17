import React, { FC, useCallback, useEffect } from 'react';

import { Icon, IconNames, Paragraph, prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { DeprecatedBadge } from '../../../../../../2_molecules/DeprecatedBadge/DeprecatedBadge';
import { USD } from '../../../../../../../constants/currencies';
import { getBobDeprecatedAssetTooltips } from '../../../../../../../constants/tokens';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../../../hooks/useChainStore';
import { useCopyAddress } from '../../../../../../../hooks/useCopyAddress';
import { useDollarValue } from '../../../../../../../hooks/useDollarValue';
import { findAsset } from '../../../../../../../utils/asset';
import { isBobChain } from '../../../../../../../utils/chain';
import { getCurrencyPrecision } from '../../../ProtocolSection/ProtocolSection.utils';
import styles from './AssetBalanceRow.module.css';
import { SdexBalance } from './SdexBalance';

type AssetBalanceRowProps = {
  token: string;
  updateUsdValue: (usdValue: string) => void;
};

export const AssetBalanceRow: FC<AssetBalanceRowProps> = ({
  token,
  updateUsdValue,
}) => {
  const onCopyAddress = useCopyAddress();
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const { weiBalance, balance } = useAssetBalance(token, chainId);
  const { usdValue } = useDollarValue(token, weiBalance);
  const asset = findAsset(token, chainId);

  useEffect(() => {
    updateUsdValue(usdValue);
  }, [usdValue, updateUsdValue]);

  const isDeprecated =
    isBobChain(chainId) && !!getBobDeprecatedAssetTooltips(token);

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(asset.address);
    onCopyAddress?.();
    if (!onCopyAddress) {
      alert('Address was copied to clipboard.');
    }
  }, [onCopyAddress, asset.address]);

  return (
    <div className="px-4 lg:px-6 border border-gray-70 grid items-center grid-cols-3 bg-gray-70 md:bg-gray-80 rounded py-[0.8125rem] text-gray-10 font-medium min-h-14">
      <AssetRenderer
        asset={token}
        showAssetLogo
        logoClassName={styles.assetLogo}
        assetClassName={styles.asset}
        chainId={chainId}
        className="text-base sm:text-xs"
        showLongName
        assetLongNameClassName="hidden lg:block"
      >
        {isDeprecated && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-gray-40 font-medium text-[10px]">
              {prettyTx(asset.address)}
              <span className="cursor-pointer" onClick={copyAddress}>
                <Icon icon={IconNames.COPY} />
              </span>
            </span>
            <DeprecatedBadge />
          </div>
        )}
      </AssetRenderer>
      <Paragraph className="text-right lg:text-left truncate">
        <AmountRenderer
          value={account ? balance : '0'}
          precision={getCurrencyPrecision(token)}
          isAnimated
        />
        {isBobChain(chainId) && <SdexBalance token={token} />}
      </Paragraph>
      <Paragraph className="text-gray-30 text-right lg:text-left truncate">
        <AmountRenderer
          value={account ? usdValue : '0'}
          suffix={USD}
          precision={getCurrencyPrecision(token)}
          isAnimated
          asIf
        />
      </Paragraph>
    </div>
  );
};
