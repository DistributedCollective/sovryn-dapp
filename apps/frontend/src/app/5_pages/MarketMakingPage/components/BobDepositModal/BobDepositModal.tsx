import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@sovryn/ui';

import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { PriceRange } from './components/PriceRange/PriceRange';
import { AmountForm } from './components/PriceRange/components/AmountForm/AmountForm';
import { SlippageSettings } from './components/PriceRange/components/SlippageSettings/SlippageSettings';
import { useDepositContext } from './contexts/BobDepositModalContext';

// TODO: This will be a prop
export const POOL_ASSET_A = COMMON_SYMBOLS.ETH;
export const POOL_ASSET_B = COMMON_SYMBOLS.SOV;

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

  const { firstAssetValue, secondAssetValue, maximumSlippage, rangeWidth } =
    useDepositContext();

  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const handleSubmit = useCallback(() => {
    console.log(
      `submit, firstAssetValue: ${firstAssetValue} , secondAssetValue: ${secondAssetValue} , maximumSlippage: ${maximumSlippage} , rangeWidth: ${rangeWidth}`,
    );
  }, [firstAssetValue, maximumSlippage, rangeWidth, secondAssetValue]);

  const isSubmitDisabled = useMemo(() => !account, [account]);

  return (
    <>
      <Dialog disableFocusTrap isOpen={isOpen}>
        <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
        <DialogBody>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={POOL_ASSET_A}
              symbol2={POOL_ASSET_B}
              label1={t(pageTranslations.returnRate)}
              value1="5.6%"
              className="flex justify-between"
            />
          </div>

          <AmountForm />
          <PriceRange />
          <SlippageSettings />
          <NewPoolStatistics
            poolAssetA={POOL_ASSET_A}
            poolAssetB={POOL_ASSET_B}
          />

          <div className="mt-8">
            <Checkbox
              checked={hasDisclaimerBeenChecked}
              onChangeValue={setHasDisclaimerBeenChecked}
              label={t(pageTranslations.depositDisclaimer)}
            />
          </div>

          <Button
            type={ButtonType.submit}
            style={ButtonStyle.primary}
            text={t(translations.common.buttons.confirm)}
            className="w-full mt-6"
            onClick={handleSubmit}
            dataAttribute="add-liquidity-confirm-button"
            disabled={isSubmitDisabled}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};
