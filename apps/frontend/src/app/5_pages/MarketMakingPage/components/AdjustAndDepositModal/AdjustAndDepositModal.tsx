import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

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
import { renderTokenSymbol } from '../../../../../utils/helpers';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { TABS } from './AdjustAndDepositModal.constants';
import { AdjustType } from './AdjustAndDepositModal.types';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';

// TODO: Fetch user balance
const maxBalance: Decimal = Decimal.from(100);

const pageTranslations = translations.marketMakingPage.adjustAndDepositModal;

type AdjustAndDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isInitialDeposit: boolean;
  pool: AmmLiquidityPool;
};

export const AdjustAndDepositModal: FC<AdjustAndDepositModalProps> = ({
  isOpen,
  onClose,
  isInitialDeposit,
  pool,
}) => {
  const [adjustType, setAdjustType] = useState(AdjustType.Deposit);
  const [value, setValue, amount] = useWeiAmountInput('');

  const handleMaxClick = useCallback(
    () => setValue(maxBalance.toString()),
    [setValue],
  );

  const token = useMemo(() => pool.assetA, [pool.assetA]);

  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(
          pageTranslations.titles[
            isInitialDeposit ? 'initialDeposit' : 'adjust'
          ],
        )}
        onClose={onClose}
      />
      <DialogBody>
        <>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={pool.assetA}
              symbol2={pool.assetB}
              label1={t(pageTranslations.currentStatistics.returnRate)}
              label2={t(pageTranslations.currentStatistics.currentBalance)}
              value1="Up to 8.55% APR"
              value2={`0 ${renderTokenSymbol(token)}`}
            />
          </div>
          <div>
            <FormGroup
              label={
                <LabelWithTabsAndMaxButton
                  token={token}
                  maxAmount={maxBalance}
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
                maxAmount={Number(maxBalance)}
                label={t(translations.common.amount)}
                className="max-w-none"
                unit={<AssetRenderer asset={token} />}
                placeholder="0"
              />
            </FormGroup>
          </div>
          <NewPoolStatistics
            amount={Decimal.fromBigNumberString(amount.toString())}
            isInitialDeposit={isInitialDeposit}
            adjustType={adjustType}
            pool={pool}
          />
        </>
      </DialogBody>
    </Dialog>
  );
};
