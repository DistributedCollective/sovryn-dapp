import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  AmountInput,
  FormGroup,
  Checkbox,
  Link,
  Button,
  ButtonType,
  ButtonStyle,
  noop,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { LabelWithTabsAndMaxButton } from '../../../../2_molecules/LabelWithTabsAndMaxButton/LabelWithTabsAndMaxButton';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { WIKI_LINKS } from '../../../../../constants/links';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { TABS } from './AdjustAndDepositModal.constants';
import { AdjustType } from './AdjustAndDepositModal.types';
import { CurrentBalance } from './components/CurrentBalance/CurrentBalance';
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
  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const handleMaxClick = useCallback(
    () => setValue(maxBalance.toString()),
    [setValue],
  );

  const token = useMemo(() => pool.assetA, [pool.assetA]);

  const decimalAmount = useMemo(
    (): Decimal => Decimal.fromBigNumberString(amount.toString()),
    [amount],
  );

  const isValidForm = useMemo(
    () =>
      value !== '' &&
      decimalAmount.gt(Decimal.ZERO) &&
      (!isInitialDeposit || (isInitialDeposit && hasDisclaimerBeenChecked)),
    [decimalAmount, hasDisclaimerBeenChecked, isInitialDeposit, value],
  );

  // TODO: Add the calculation
  const btcValue = useMemo(
    () => decimalAmount.mul(0.1).toString(),
    [decimalAmount],
  );

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
              value2={<CurrentBalance pool={pool} />}
            />
          </div>

          <div>
            <FormGroup
              label={
                isInitialDeposit ? (
                  <div className="flex justify-end w-full">
                    <MaxButton
                      value={maxBalance}
                      token={token}
                      onClick={handleMaxClick}
                    />
                  </div>
                ) : (
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
                )
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

              <AmountInput
                label={t(translations.common.amount)}
                value={btcValue}
                className="max-w-none mt-6"
                unit={<AssetRenderer asset={SupportedTokens.rbtc} />}
                readOnly
              />
            </FormGroup>
          </div>

          <NewPoolStatistics
            amount={decimalAmount}
            isInitialDeposit={isInitialDeposit}
            adjustType={adjustType}
            pool={pool}
          />

          {isInitialDeposit && (
            <div className="mt-6">
              <Checkbox
                checked={hasDisclaimerBeenChecked}
                onChangeValue={setHasDisclaimerBeenChecked}
                label={
                  <Trans
                    i18nKey={t(pageTranslations.initialDepositDisclaimer)}
                    components={[
                      <Link
                        text={t(translations.common.learnMore)}
                        href={WIKI_LINKS.BORROWING} // TODO: Find out what link should be here, it's not mentioned in the PRD
                        className="no-underline"
                      />,
                    ]}
                  />
                }
              />
            </div>
          )}

          <div className="mt-6 flex flex-row items-center justify-between gap-8">
            <Button
              type={ButtonType.submit}
              style={ButtonStyle.primary}
              text={t(translations.common.buttons.confirm)}
              className="w-full"
              onClick={noop} // TODO: Add a submit handler
              dataAttribute="new-loan-confirm-button"
              disabled={!isValidForm}
            />
          </div>
        </>
      </DialogBody>
    </Dialog>
  );
};
