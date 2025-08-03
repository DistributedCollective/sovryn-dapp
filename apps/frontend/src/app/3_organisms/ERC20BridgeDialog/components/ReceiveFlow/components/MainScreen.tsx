import React, { useCallback, useContext, useEffect } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ButtonStyle,
  Paragraph,
  Select,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { AssetRenderer } from '../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../../locales/i18n';
import {
  ReceiveFlowContext,
  ReceiveFlowStep,
} from '../../../contexts/receiveflow';
import { useBridgeAggregatorBalance } from '../../../hooks/useBridgeAggregatorBalance';
import { useAssetsByTargetChain } from '../../../hooks/useBridgeAssets';
import { Limits } from '../../Limits';
import { NetworkRenderer } from '../../NetworkRenderer';

export const MainScreen: React.FC = () => {
  const { set, token, chainId } = useContext(ReceiveFlowContext);
  const assets = useAssetsByTargetChain(RSK_CHAIN_ID);

  const { data: aggregatorBalance } = useBridgeAggregatorBalance(
    chainId,
    RSK_CHAIN_ID,
    token,
  );

  const uniqueAssets = assets.filter(
    (asset, index, arr) =>
      arr.findIndex(a => a.symbol === asset.symbol) === index,
  );

  const filteredAssets = assets.filter(a => a.symbol === token);
  const chains = filteredAssets
    .filter(a => a.symbol === token)
    .map(a => a.mainChainId);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: ReceiveFlowStep.AMOUNT })),
    [set],
  );
  const setAsset = useCallback(
    (symbol: string) => {
      const asset = assets.find(a => a.symbol === symbol);
      set(prevState => ({
        ...prevState,
        token: asset?.symbol,
        chainId: asset?.mainChainId,
      }));
    },
    [assets, set],
  );
  const setChain = useCallback(
    (network: string) => {
      const asset = filteredAssets.find(a => a.mainChainId === network);
      set(prevState => ({
        ...prevState,
        token: asset?.symbol,
        chainId: asset?.mainChainId,
      }));
    },
    [filteredAssets, set],
  );

  useEffect(() => {
    if (!token && !chainId && uniqueAssets.length > 0) {
      setAsset(uniqueAssets[0].symbol);
    }
  }, [chainId, setAsset, token, uniqueAssets]);

  return (
    <div>
      <div className="mb-6">
        <Paragraph className="mb-2 text-sm font-medium">Asset</Paragraph>

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
        <Paragraph className="mb-2 text-sm font-medium">Receive from</Paragraph>

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

      <AmountInput
        className="w-full max-w-full mb-6"
        label="Avaiaible liquidity"
        value={formatUnits(aggregatorBalance || '0')}
        readOnly
        unit={token}
      />

      <Limits sourceChain={chainId} targetChain={RSK_CHAIN_ID} asset={token} />

      <Button
        onClick={onContinueClick}
        text={t(translations.common.buttons.continue)}
        className="w-full mt-12"
        style={ButtonStyle.secondary}
        dataAttribute="funding-receive-instructions-confirm"
        disabled={!token || !chainId}
      />
    </div>
  );
};
