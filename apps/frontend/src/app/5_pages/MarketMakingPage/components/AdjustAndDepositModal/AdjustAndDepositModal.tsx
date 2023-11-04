import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  AmountInput,
  FormGroup,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { LabelWithTabsAndMaxButton } from '../../../../2_molecules/LabelWithTabsAndMaxButton/LabelWithTabsAndMaxButton';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { TABS } from './AdjustAndDepositModal.constants';
import { AdjustType } from './AdjustAndDepositModal.types';

const pageTranslations = translations.marketMakingPage.adjustAndDepositModal;

type AdjustAndDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AdjustAndDepositModal: FC<AdjustAndDepositModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [adjustType, setAdjustType] = useState(AdjustType.Deposit);
  const [value, setValue] = useWeiAmountInput('');

  const handleMaxClick = useCallback(
    () => setValue(Decimal.from(100).toString()),
    [setValue],
  );

  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(pageTranslations.titles.adjust)}
        onClose={onClose}
      />
      <DialogBody>
        <>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={SupportedTokens.dllr}
              label1={t(pageTranslations.currentStatistics.returnRate)}
              label2={t(pageTranslations.currentStatistics.currentBalance)}
              value1="Up to 8.55% APR"
              value2="0 DLLR"
            />
          </div>
          <div>
            <FormGroup
              label={
                <LabelWithTabsAndMaxButton
                  token={SupportedTokens.dllr}
                  maxAmount={Decimal.from(100)}
                  tabs={TABS}
                  onTabChange={setAdjustType}
                  onMaxAmountClicked={handleMaxClick}
                  index={adjustType}
                  setIndex={setAdjustType}
                  dataAttributePrefix="adjust-amm-pool"
                />
              }
              labelElement="div"
              className="max-w-none mt-8"
              dataAttribute="adjust-amm-pool-amount"
            >
              <AmountInput
                value={value}
                onChangeText={setValue}
                maxAmount={100}
                label={t(translations.common.amount)}
                className="max-w-none"
                unit={<AssetRenderer asset={SupportedTokens.dllr} />}
                placeholder="0"
              />
            </FormGroup>
          </div>
        </>
      </DialogBody>
    </Dialog>
  );
};
