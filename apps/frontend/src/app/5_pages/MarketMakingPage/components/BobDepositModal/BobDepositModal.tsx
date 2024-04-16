import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Accordion,
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
  FormGroup,
} from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../hooks/useAccount';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { AmmLiquidityPoolDictionary } from '../../utils/AmmLiquidityPoolDictionary';
import { useGetMaxDeposit } from '../AdjustAndDepositModal/hooks/useGetMaxDeposit';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { PriceRange } from './components/PriceRange/PriceRange';

// TODO: This will be a prop and will likely use a different set of pools
const POOL = AmmLiquidityPoolDictionary.list().filter(
  pool => pool.assetA === COMMON_SYMBOLS.DLLR,
)[0];

const pageTranslations = translations.bobMarketMakingPage.depositModal;

type BobDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const BobDepositModal: FC<BobDepositModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { account } = useAccount();

  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const [firstAssetValue, setFirstAssetValue] = useWeiAmountInput('');
  const [secondAssetValue, setSecondAssetValue] = useWeiAmountInput('');

  const [slippageTolerance, setSlippageTolerance] = useState(0.5);

  const [isSlippageExpanded, setIsSlippageExpanded] = useState(false);

  // TODO: We will need a separate hook for Ambient pool deposits
  const { balanceTokenA, balanceTokenB } = useGetMaxDeposit(POOL, true);

  const handleFirstAssetMaxClick = useCallback(() => {
    setFirstAssetValue(balanceTokenA.toString());
  }, [balanceTokenA, setFirstAssetValue]);

  const handleSecondAssetMaxClick = useCallback(() => {
    setSecondAssetValue(balanceTokenB.toString());
  }, [balanceTokenB, setSecondAssetValue]);

  const handleSubmit = useCallback(() => {
    console.log(`submit`);
  }, []);

  const isSubmitDisabled = useMemo(() => !account, [account]);

  return (
    <>
      <Dialog disableFocusTrap isOpen={isOpen}>
        <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
        <DialogBody>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={POOL.assetA}
              symbol2={POOL.assetB}
              label1={t(pageTranslations.returnRate)}
              value1="5.6%"
              className="flex justify-between"
            />
          </div>

          <FormGroup
            label={
              <div className="flex justify-end w-full">
                <MaxButton
                  value={balanceTokenA}
                  token={POOL.assetA}
                  onClick={handleFirstAssetMaxClick}
                />
              </div>
            }
            labelElement="div"
            className="max-w-none mt-8"
            dataAttribute="bob-amm-pool-deposit-asset1"
          >
            <AmountInput
              value={firstAssetValue}
              onChangeText={setFirstAssetValue}
              maxAmount={balanceTokenA.toNumber()}
              label={t(translations.common.amount)}
              className="max-w-none"
              unit={<AssetRenderer asset={POOL.assetA} />}
              disabled={!account}
              placeholder="0"
            />
          </FormGroup>

          <FormGroup
            label={
              <div className="flex justify-end w-full">
                <MaxButton
                  value={balanceTokenB}
                  token={POOL.assetB}
                  onClick={handleSecondAssetMaxClick}
                />
              </div>
            }
            labelElement="div"
            className="max-w-none mt-8"
            dataAttribute="bob-amm-pool-deposit-asset2"
          >
            <AmountInput
              value={secondAssetValue}
              onChangeText={setSecondAssetValue}
              maxAmount={balanceTokenB.toNumber()}
              label={t(translations.common.amount)}
              className="max-w-none"
              unit={<AssetRenderer asset={POOL.assetB} />}
              disabled={!account}
              placeholder="0"
            />
          </FormGroup>

          <PriceRange />

          <div className="bg-gray-90 px-2 py-4 mt-6 rounded">
            <Accordion
              label={t(pageTranslations.slippage)}
              open={isSlippageExpanded}
              onClick={() => setIsSlippageExpanded(!isSlippageExpanded)}
              labelClassName="justify-between"
            >
              <AmountInput
                value={slippageTolerance}
                onChange={e => setSlippageTolerance(e.target.value)}
                label={t(pageTranslations.maximumSlippage)}
                className="max-w-none w-full"
                unit="%"
                step={0.01}
                decimalPrecision={2}
                placeholder="0"
                max={100}
              />
            </Accordion>
          </div>

          <NewPoolStatistics pool={POOL} />

          <div className="mt-8">
            <Checkbox
              checked={hasDisclaimerBeenChecked}
              onChangeValue={setHasDisclaimerBeenChecked}
              label={t(pageTranslations.depositDisclaimer)}
            />
          </div>

          <div className="mt-6 flex flex-row items-center justify-between gap-8">
            <Button
              type={ButtonType.submit}
              style={ButtonStyle.primary}
              text={t(translations.common.buttons.confirm)}
              className="w-full"
              onClick={handleSubmit}
              dataAttribute="new-loan-confirm-button"
              disabled={isSubmitDisabled}
            />
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};
