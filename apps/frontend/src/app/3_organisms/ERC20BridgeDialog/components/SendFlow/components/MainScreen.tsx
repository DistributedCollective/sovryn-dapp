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

import { translations } from '../../../../../../locales/i18n';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { useAssetsBySourceChain } from '../../../hooks/useBridgeAssets';

export const MainScreen: React.FC = () => {
  const assets = useAssetsBySourceChain(ChainIds.RSK_TESTNET);
  const { set, asset } = useContext(SendFlowContext);
  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: SendFlowStep.AMOUNT })),
    [set],
  );
  const setAsset = useCallback(
    (assetId: string) => {
      const asset = assets.find(a => a.id === assetId);
      set(prevState => ({ ...prevState, asset: asset ?? undefined }));
    },
    [assets, set],
  );

  return (
    <div>
      <div className="mb-6">
        <Paragraph className="mb-2">Asset</Paragraph>

        <Select
          className="w-full"
          onChange={setAsset}
          options={assets.map(asset => ({
            value: asset.id,
            label: asset.symbol,
          }))}
          value={asset?.id || ''}
        />
      </div>

      <div className="mb-6">
        <Paragraph className="mb-2">Send to</Paragraph>

        <Select
          className="w-full"
          onChange={setAsset}
          options={assets.map(asset => ({
            value: asset.id,
            label: asset.symbol,
          }))}
          value={asset?.id || ''}
        />
      </div>
      <div>
        <AmountInput
          className="w-full"
          label="Avaiaible liquidity"
          value="12,345.13 ETH"
          disabled
        />
      </div>

      <Button
        onClick={onContinueClick}
        text={t(translations.common.buttons.continue)}
        className="w-full mt-12"
        style={ButtonStyle.secondary}
        dataAttribute="funding-send-instructions-confirm"
        disabled={!asset}
      />
    </div>
  );
};
