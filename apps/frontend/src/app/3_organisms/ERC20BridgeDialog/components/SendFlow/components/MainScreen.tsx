import React, { useCallback, useContext } from 'react';

import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import {
  AmountInput,
  Button,
  ButtonStyle,
  Paragraph,
  Select,
} from '@sovryn/ui';

import { AssetRenderer } from '../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../../locales/i18n';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { useAssetsBySourceChain } from '../../../hooks/useBridgeAssets';
import { NetworkRenderer } from '../../NetworkRenderer';

export const MainScreen: React.FC = () => {
  const { set, token, chainId } = useContext(SendFlowContext);
  const assets = useAssetsBySourceChain(ChainIds.RSK_MAINNET);

  const uniqueAssets = assets.filter(
    (asset, index, arr) =>
      arr.findIndex(a => a.symbol === asset.symbol) === index,
  );

  const filteredAssets = assets.filter(a => a.symbol === token);
  const chains = filteredAssets
    .filter(a => a.symbol === token)
    .map(a => a.sideChainId);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: SendFlowStep.AMOUNT })),
    [set],
  );

  const setAsset = useCallback(
    (symbol: string) => {
      const asset = assets.find(a => a.symbol === symbol);
      set(prevState => ({
        ...prevState,
        token: asset?.symbol,
        chainId: asset?.sideChainId,
      }));
    },
    [assets, set],
  );
  const setChain = useCallback(
    (network: string) => {
      const asset = filteredAssets.find(a => a.sideChainId === network);
      set(prevState => ({
        ...prevState,
        token: asset?.symbol,
        chainId: asset?.sideChainId,
      }));
    },
    [filteredAssets, set],
  );

  return (
    <div>
      <div className="mb-6">
        <Paragraph className="mb-2 text-sm">Asset</Paragraph>

        <Select
          className="w-full"
          onChange={setAsset}
          options={uniqueAssets.map(asset => ({
            value: asset.symbol,
            label: (
              <AssetRenderer
                showAssetLogo
                asset={asset.symbol}
                chainId={asset.mainChainId}
                assetClassName="font-medium"
              />
            ),
          }))}
          value={token || ''}
        />
      </div>

      <div className="mb-6">
        <Paragraph className="mb-2 text-sm">Send to</Paragraph>

        <Select
          className="w-full"
          onChange={setChain}
          options={chains
            .filter(chain => !!chain)
            .map(chainId => ({
              value: chainId || '',
              label: <NetworkRenderer chainId={chainId} />,
            }))}
          value={chainId || ''}
        />
      </div>
      <div>
        <AmountInput
          className="w-full max-w-full"
          label="Avaiaible liquidity"
          value="12,345.13 ETH"
          readOnly
        />
      </div>

      <Button
        onClick={onContinueClick}
        text={t(translations.common.buttons.continue)}
        className="w-full mt-12"
        style={ButtonStyle.secondary}
        dataAttribute="funding-send-instructions-confirm"
        disabled={!token || !chainId}
      />
    </div>
  );
};
