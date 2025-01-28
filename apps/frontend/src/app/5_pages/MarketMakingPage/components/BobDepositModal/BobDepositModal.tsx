import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';
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
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import {
  DEFAULT_RANGE_WIDTH,
  DEFAULT_SLIPPAGE,
} from './BobDepositModal.constants';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { PriceRange } from './components/PriceRange/PriceRange';
import { AmountForm } from './components/PriceRange/components/AmountForm/AmountForm';
import { SlippageSettings } from './components/PriceRange/components/SlippageSettings/SlippageSettings';
import { useDepositContext } from './contexts/BobDepositModalContext';
import { useHandleSubmit } from './hooks/useHandleSubmit';
import { useValidateDepositAmounts } from './hooks/useValidateDepositAmounts';

const pageTranslations = translations.bobMarketMakingPage.depositModal;

type BobDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
};

export const BobDepositModal: FC<BobDepositModalProps> = ({
  isOpen,
  onClose,
  pool,
}) => {
  const {
    firstAssetValue,
    secondAssetValue,
    minimumPrice,
    maximumPrice,
    setMinimumPrice,
    setMaximumPrice,
    setFirstAssetValue,
    setSecondAssetValue,
    setIsBalancedRange,
    setRangeWidth,
    setMaximumSlippage,
    setLowerBoundaryPercentage,
    setUpperBoundaryPercentage,
    setIsFirstAssetOutOfRange,
    setIsSecondAssetOutOfRange,
  } = useDepositContext();
  const { account } = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const depositLocked = checkMaintenance(States.BOB_DEPOSIT_LIQUIDITY);

  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const { base, quote } = useMemo(() => pool, [pool]);
  const { isFirstAssetValueInvalid, isSecondAssetValueInvalid } =
    useValidateDepositAmounts(base.symbol, quote.symbol);

  const onComplete = useCallback(() => {
    onClose();
    setFirstAssetValue('');
    setSecondAssetValue('');
    setHasDisclaimerBeenChecked(false);
    setIsBalancedRange(true);
    setRangeWidth(DEFAULT_RANGE_WIDTH);
    setMaximumSlippage(DEFAULT_SLIPPAGE);
    setMinimumPrice(0);
    setMaximumPrice(0);
    setLowerBoundaryPercentage(DEFAULT_RANGE_WIDTH * -1);
    setUpperBoundaryPercentage(DEFAULT_RANGE_WIDTH);
    setIsFirstAssetOutOfRange(false);
    setIsSecondAssetOutOfRange(false);
  }, [
    onClose,
    setFirstAssetValue,
    setSecondAssetValue,
    setMinimumPrice,
    setMaximumPrice,
    setHasDisclaimerBeenChecked,
    setIsBalancedRange,
    setRangeWidth,
    setMaximumSlippage,
    setLowerBoundaryPercentage,
    setUpperBoundaryPercentage,
    setIsFirstAssetOutOfRange,
    setIsSecondAssetOutOfRange,
  ]);

  const handleSubmit = useHandleSubmit(pool, onComplete);

  const isSubmitDisabled = useMemo(
    () =>
      !account ||
      !hasDisclaimerBeenChecked ||
      (firstAssetValue === '0' && secondAssetValue === '0') ||
      minimumPrice >= maximumPrice ||
      (!firstAssetValue && !secondAssetValue) ||
      isFirstAssetValueInvalid ||
      isSecondAssetValueInvalid ||
      depositLocked,
    [
      account,
      firstAssetValue,
      hasDisclaimerBeenChecked,
      isFirstAssetValueInvalid,
      isSecondAssetValueInvalid,
      maximumPrice,
      minimumPrice,
      secondAssetValue,
      depositLocked,
    ],
  );

  return (
    <>
      <Dialog disableFocusTrap isOpen={isOpen}>
        <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
        <DialogBody>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={base.symbol}
              symbol2={quote.symbol}
              className="flex justify-between"
            />
          </div>
          <AmountForm pool={pool} />
          <PriceRange pool={pool} />
          <SlippageSettings />
          <NewPoolStatistics pool={pool} />
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
