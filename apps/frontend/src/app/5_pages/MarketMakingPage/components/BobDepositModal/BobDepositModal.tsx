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
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { PriceRange } from './components/PriceRange/PriceRange';
import { AmountForm } from './components/PriceRange/components/AmountForm/AmountForm';
import { SlippageSettings } from './components/PriceRange/components/SlippageSettings/SlippageSettings';
import { useDepositContext } from './contexts/BobDepositModalContext';
import { useHandleSubmit } from './hooks/useHandleSubmit';

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
  const { firstAssetValue, secondAssetValue } = useDepositContext();
  const { account } = useAccount();

  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const handleSubmit = useHandleSubmit('ETH', 'SOV');

  const isSubmitDisabled = useMemo(
    () =>
      !account ||
      !hasDisclaimerBeenChecked ||
      (firstAssetValue === '0' && secondAssetValue === '0') ||
      (!firstAssetValue && !secondAssetValue),
    [account, firstAssetValue, hasDisclaimerBeenChecked, secondAssetValue],
  );

  return (
    <>
      <Dialog disableFocusTrap isOpen={isOpen}>
        <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
        <DialogBody>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={POOL_ASSET_A}
              symbol2={POOL_ASSET_B}
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
