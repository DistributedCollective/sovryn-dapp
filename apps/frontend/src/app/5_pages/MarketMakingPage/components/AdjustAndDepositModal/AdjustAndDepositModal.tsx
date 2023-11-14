import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { SupportedTokens, getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
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
  ErrorBadge,
  ErrorLevel,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../config/chains';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { LabelWithTabsAndMaxButton } from '../../../../2_molecules/LabelWithTabsAndMaxButton/LabelWithTabsAndMaxButton';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { GAS_LIMIT } from '../../../../../constants/gasLimits';
import { WIKI_LINKS } from '../../../../../constants/links';
import { useAccount } from '../../../../../hooks/useAccount';
import { useMaxAssetBalance } from '../../../../../hooks/useMaxAssetBalance';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { decimalic, fromWei, toWei } from '../../../../../utils/math';
import { useGetExpectedTokenAmount } from '../../hooks/useGetExpectedTokenAmount';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { useHandleMarketMaking } from '../../hooks/useHandleMarketMaking';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { TABS } from './AdjustAndDepositModal.constants';
import { AdjustType } from './AdjustAndDepositModal.types';
import { CurrentBalance } from './components/CurrentBalance/CurrentBalance';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { useMinReturn } from './hooks/useGetMinimumReturn';

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
  const [tokenPoolBalance, setTokenPoolBalance] = useState('0');
  const { account } = useAccount();
  const { onDeposit, onWithdraw } = useHandleMarketMaking(onClose);
  const { balanceA, loadingA } = useGetUserInfo(pool);

  const poolWeiAmount = useMemo(
    () =>
      decimalic(amount.toString())
        .div(decimalic(balanceA.toString()).div(tokenPoolBalance))
        .toNumber()
        .toFixed(0),
    [amount, balanceA, tokenPoolBalance],
  );
  const token = useMemo(() => pool.assetA, [pool.assetA]);
  const isDeposit = useMemo(
    () => adjustType === AdjustType.Deposit,
    [adjustType],
  );
  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const { balance: userBalance } = useMaxAssetBalance(
    token,
    defaultChainId,
    GAS_LIMIT.MARKET_MAKING_ADD_LIQUIDITY,
  );

  const maxBalance = useMemo(
    () => (isDeposit ? userBalance : decimalic(fromWei(balanceA.toString()))),
    [isDeposit, balanceA, userBalance],
  );

  const handleMaxClick = useCallback(
    () => setValue(maxBalance.toString()),
    [maxBalance, setValue],
  );

  const decimalAmount = useMemo(
    (): Decimal => decimalic(amount.toString()),
    [amount],
  );

  const { amount: btcValue } = useGetExpectedTokenAmount(pool, decimalAmount);

  const minReturn1 = useMinReturn(decimalAmount);
  const minReturn2 = useMinReturn(decimalic(btcValue));

  const handleSubmit = useCallback(() => {
    if (adjustType === AdjustType.Deposit) {
      onDeposit(pool, decimalic(amount.toString()), decimalic(btcValue));
    } else {
      onWithdraw(pool, poolWeiAmount, decimalic(amount.toString()), [
        minReturn1,
        minReturn2,
      ]);
    }
  }, [
    btcValue,
    onDeposit,
    onWithdraw,
    pool,
    adjustType,
    amount,
    poolWeiAmount,
    minReturn1,
    minReturn2,
  ]);

  const isValidForm = useMemo(
    () =>
      (!isInitialDeposit || (isInitialDeposit && hasDisclaimerBeenChecked)) &&
      decimalAmount.lte(decimalic(toWei(maxBalance.toString()).toString())),
    [hasDisclaimerBeenChecked, isInitialDeposit, maxBalance, decimalAmount],
  );

  const isSubmitDisabled = useMemo(
    () =>
      decimalAmount.isZero() ||
      !isValidForm ||
      decimalAmount.gt(decimalic(toWei(maxBalance.toString()).toString())),
    [maxBalance, decimalAmount, isValidForm],
  );

  useEffect(() => {
    const fetchPoolBalance = async () => {
      const { abi, address } = await getProtocolContract(
        'liquidityMiningProxy',
        defaultChainId,
      );
      const contract = new ethers.Contract(
        address,
        abi,
        getProvider(defaultChainId),
      );
      if (!contract) {
        return;
      }
      const poolBalance = await contract.getUserInfo(pool.poolTokenA, account);
      if (poolBalance) {
        setTokenPoolBalance(poolBalance.amount.toString());
      }
    };
    if (amount.gt(0) && adjustType === AdjustType.Withdraw && !loadingA) {
      fetchPoolBalance();
    }
  }, [amount, adjustType, loadingA, pool, account]);

  useEffect(() => setValue(''), [setValue, adjustType, account]);

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
                maxAmount={maxBalance.toNumber()}
                label={t(translations.common.amount)}
                className="max-w-none"
                unit={<AssetRenderer asset={token} />}
                disabled={!account}
                invalid={!isValidForm}
                placeholder="0"
              />
              {!isValidForm && amount.gt(0) && (
                <ErrorBadge
                  level={ErrorLevel.Critical}
                  message={t(
                    translations.marketMakingPage.form.invalidAmountError,
                  )}
                  dataAttribute="adjust-market-making-amount-error"
                />
              )}

              <AmountInput
                label={t(translations.common.amount)}
                value={decimalic(fromWei(btcValue)).toString()}
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
              onClick={handleSubmit}
              dataAttribute="new-loan-confirm-button"
              disabled={isSubmitDisabled}
            />
          </div>
        </>
      </DialogBody>
    </Dialog>
  );
};
