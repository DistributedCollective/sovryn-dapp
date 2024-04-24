import React, { FC, useMemo, useState } from 'react';

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
import { AmbientLiquidityPool } from '../AmbientMarketMaking/utils/AmbientLiquidityPool';
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
  pool: AmbientLiquidityPool;
};

export const BobDepositModal: FC<BobDepositModalProps> = ({
  isOpen,
  onClose,
  pool,
}) => {
  const { firstAssetValue, secondAssetValue, minimumPrice, maximumPrice } =
    useDepositContext();
  const { account } = useAccount();

  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const { base, quote } = useMemo(() => pool, [pool]);
  const { isFirstAssetValueInvalid, isSecondAssetValueInvalid } =
    useValidateDepositAmounts(base, quote);

  const handleSubmit = useHandleSubmit(base, quote);

  const isSubmitDisabled = useMemo(
    () =>
      !account ||
      !hasDisclaimerBeenChecked ||
      (firstAssetValue === '0' && secondAssetValue === '0') ||
      minimumPrice >= maximumPrice ||
      (!firstAssetValue && !secondAssetValue) ||
      isFirstAssetValueInvalid ||
      isSecondAssetValueInvalid,
    [
      account,
      firstAssetValue,
      hasDisclaimerBeenChecked,
      isFirstAssetValueInvalid,
      isSecondAssetValueInvalid,
      maximumPrice,
      minimumPrice,
      secondAssetValue,
    ],
  );

  return (
    <>
      <Dialog disableFocusTrap isOpen={isOpen}>
        <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
        <DialogBody>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={base}
              symbol2={quote}
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
