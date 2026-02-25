import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import {
  AmountInput,
  Button,
  ButtonSize,
  ButtonStyle,
  Dialog,
  DialogBody,
  DialogHeader,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useAccount } from '../../../hooks/useAccount';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useWeiAmountInput } from '../../../hooks/useWeiAmountInput';
import { translations } from '../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../utils/asset';
import { removeTrailingZerosFromString } from '../../../utils/helpers';
import { bigNumberic, decimalic, fromWei } from '../../../utils/math';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';
import { MaxButton } from '../MaxButton/MaxButton';

const RUSDT_MIGRATION_CONTRACT = '0xd143f576b8e889b1c90ebef8d0c4bfbb3316fdd2';
const RUSDT_MIGRATION_ALLOWANCE_PROVIDER =
  '0x0E8b356B8f5A269C0Cb3975E64FC9C3193C63d01';
const RUSDT_TO_USDT_DECIMALS_MULTIPLIER = bigNumberic('1000000000000');

type RusdtMigrationNoticeProps = {
  className?: string;
  buttonClassName?: string;
  dataAttributePrefix?: string;
};

export const RusdtMigrationNotice: FC<RusdtMigrationNoticeProps> = ({
  className,
  buttonClassName,
  dataAttributePrefix = 'rusdt-migration',
}) => {
  const { value: blockNumber } = useBlockNumber(RSK_CHAIN_ID);
  const { account, signer } = useAccount();
  const { balance, weiBalance, loading } = useAssetBalance(
    COMMON_SYMBOLS.RUSDT,
    RSK_CHAIN_ID,
  );
  const {
    weiBalance: migrationUsdtBalanceWei,
    loading: migrationBalanceLoading,
  } = useAssetBalance(
    COMMON_SYMBOLS.USDT,
    RSK_CHAIN_ID,
    RUSDT_MIGRATION_ALLOWANCE_PROVIDER,
  );

  const [amount, setAmount, enteredAmountWei] = useWeiAmountInput('');
  const [migrationAllowanceWei, setMigrationAllowanceWei] = useState('0');
  const [migrationAllowanceLoading, setMigrationAllowanceLoading] =
    useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadMigrationAllowance = async () => {
      try {
        setMigrationAllowanceLoading(true);
        const { contract } = await getAssetData(
          COMMON_SYMBOLS.USDT,
          RSK_CHAIN_ID,
        );
        const usdtContract = contract(getProvider(RSK_CHAIN_ID));
        const allowance = await usdtContract.allowance(
          RUSDT_MIGRATION_ALLOWANCE_PROVIDER,
          RUSDT_MIGRATION_CONTRACT,
        );

        if (!cancelled) {
          setMigrationAllowanceWei(allowance.toString());
        }
      } catch (error) {
        console.error('Failed loading migration allowance', error);
        if (!cancelled) {
          setMigrationAllowanceWei('0');
        }
      } finally {
        if (!cancelled) {
          setMigrationAllowanceLoading(false);
        }
      }
    };

    void loadMigrationAllowance();

    return () => {
      cancelled = true;
    };
  }, [blockNumber]);

  const migrationCapacityWei = useMemo(() => {
    const balanceLimit = bigNumberic(migrationUsdtBalanceWei);
    const allowanceLimit = bigNumberic(migrationAllowanceWei);

    return balanceLimit.lt(allowanceLimit) ? balanceLimit : allowanceLimit;
  }, [migrationAllowanceWei, migrationUsdtBalanceWei]);

  const maxMigratableWei = useMemo(() => {
    const userBalanceWei = bigNumberic(weiBalance);
    const migrationCapacityRusdtWei = migrationCapacityWei.mul(
      RUSDT_TO_USDT_DECIMALS_MULTIPLIER,
    );

    return userBalanceWei.lt(migrationCapacityRusdtWei)
      ? userBalanceWei
      : migrationCapacityRusdtWei;
  }, [migrationCapacityWei, weiBalance]);

  const maxMigratableAmount = useMemo(
    () => removeTrailingZerosFromString(fromWei(maxMigratableWei)),
    [maxMigratableWei],
  );

  const maxOutputWeiAmount = useMemo(
    () => maxMigratableWei.div(RUSDT_TO_USDT_DECIMALS_MULTIPLIER).toString(),
    [maxMigratableWei],
  );

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const hasBalance = useMemo(() => balance.gt(Decimal.ZERO), [balance]);
  const hasMigrationCapacity = useMemo(
    () => maxMigratableWei.gt(0),
    [maxMigratableWei],
  );
  const migrationLimitLoading =
    migrationBalanceLoading || migrationAllowanceLoading;
  const hasValidAmount = useMemo(() => {
    if (!String(amount || '').trim().length) {
      return false;
    }

    return (
      enteredAmountWei.gte(RUSDT_TO_USDT_DECIMALS_MULTIPLIER) &&
      enteredAmountWei.lte(maxMigratableWei)
    );
  }, [amount, enteredAmountWei, maxMigratableWei]);

  const showNoBalanceWarning = !account || !hasBalance;
  const showNoCapacityWarning =
    !!account && hasBalance && !migrationLimitLoading && !hasMigrationCapacity;
  const showInvalidAmountWarning =
    !!account &&
    hasBalance &&
    !!String(amount || '').trim().length &&
    !hasValidAmount;

  const canMigrate =
    !!account &&
    !!signer &&
    hasBalance &&
    !loading &&
    !migrationLimitLoading &&
    hasMigrationCapacity &&
    hasValidAmount;

  const handleOpenModal = useCallback(() => {
    setAmount('');
    setIsModalOpen(true);
  }, [setAmount]);

  const handleCloseModal = useCallback(() => {
    setAmount('');
    setIsModalOpen(false);
  }, [setAmount]);

  const handleSetMaxAmount = useCallback(() => {
    setAmount(maxMigratableAmount);
  }, [maxMigratableAmount, setAmount]);

  const handleMigrate = useCallback(async () => {
    if (!canMigrate || !signer) {
      return;
    }

    try {
      const { contract } = await getAssetData(
        COMMON_SYMBOLS.RUSDT,
        RSK_CHAIN_ID,
      );
      const rusdtContract = contract(signer);

      const transactions: Transaction[] = [
        {
          title: t(translations.rusdtMigration.tx.migrate),
          request: {
            type: TransactionType.signTransaction,
            contract: rusdtContract,
            fnName: 'transfer',
            args: [RUSDT_MIGRATION_CONTRACT, enteredAmountWei.toString()],
            gasLimit: 100000, // Set a reasonable gas limit for the migration transaction
          },
        },
      ];

      setTransactions(transactions);
      setTitle(t(translations.rusdtMigration.tx.title));
      setIsOpen(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error('rUSDT migration setup failed', error);
    }
  }, [
    canMigrate,
    enteredAmountWei,
    setIsOpen,
    setTitle,
    setTransactions,
    signer,
  ]);

  return (
    <>
      <div className={className}>
        <Button
          style={ButtonStyle.ghost}
          size={ButtonSize.small}
          text={t(translations.rusdtMigration.cta)}
          onClick={handleOpenModal}
          className={classNames('w-auto h-auto py-0 px-0.5', buttonClassName)}
          dataAttribute={`${dataAttributePrefix}-open-button`}
        />
      </div>

      <Dialog disableFocusTrap isOpen={isModalOpen}>
        <DialogHeader
          title={t(translations.rusdtMigration.modal.title)}
          onClose={handleCloseModal}
        />
        <DialogBody>
          <Paragraph className="text-gray-30" size={ParagraphSize.base}>
            {t(translations.rusdtMigration.modal.description)}
          </Paragraph>

          <div className="bg-gray-90 rounded p-4 mt-4">
            <Paragraph size={ParagraphSize.small} className="text-gray-30">
              {t(translations.rusdtMigration.modal.currentBalance)}
            </Paragraph>
            <Paragraph className="font-medium mt-1">
              <AmountRenderer
                value={account ? balance : '0'}
                suffix={COMMON_SYMBOLS.RUSDT}
              />
            </Paragraph>

            <Paragraph size={ParagraphSize.small} className="text-gray-30 mt-3">
              {t(translations.rusdtMigration.modal.maxMigratable)}
            </Paragraph>
            <Paragraph className="font-medium mt-1">
              <AmountRenderer
                value={account ? maxMigratableAmount : '0'}
                suffix={COMMON_SYMBOLS.RUSDT}
              />
              &nbsp;&nbsp;-&gt;&nbsp;&nbsp;
              <AmountRenderer
                value={account ? decimalic(maxOutputWeiAmount).toUnits(6) : '0'}
                suffix={COMMON_SYMBOLS.USDT}
                isAnimated
              />
            </Paragraph>
          </div>

          <div className="mt-4">
            <div className="w-full flex justify-between mt-4 mb-2 gap-2">
              <Paragraph size={ParagraphSize.small} className="text-gray-30">
                {t(translations.rusdtMigration.modal.amount)}
              </Paragraph>
              <MaxButton
                onClick={handleSetMaxAmount}
                value={maxMigratableAmount}
                token={COMMON_SYMBOLS.SOV}
              />
            </div>

            <AmountInput
              className="w-full max-w-2xl"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              invalid={showInvalidAmountWarning}
              disabled={
                !account || migrationLimitLoading || !hasMigrationCapacity
              }
              dataAttribute={`${dataAttributePrefix}-amount-input`}
              maxAmount={Number(maxMigratableAmount)}
              unit={COMMON_SYMBOLS.RUSDT}
            />
          </div>

          {showInvalidAmountWarning && (
            <Paragraph size={ParagraphSize.small} className="text-gray-30 mt-3">
              {t(translations.rusdtMigration.modal.invalidAmount)}
            </Paragraph>
          )}
          {showNoBalanceWarning && (
            <Paragraph size={ParagraphSize.small} className="text-gray-30 mt-3">
              {t(translations.rusdtMigration.modal.noBalance)}
            </Paragraph>
          )}
          {showNoCapacityWarning && (
            <Paragraph size={ParagraphSize.small} className="text-gray-30 mt-3">
              {t(translations.rusdtMigration.modal.capacityUnavailable)}
            </Paragraph>
          )}

          <Button
            style={ButtonStyle.primary}
            text={t(translations.rusdtMigration.modal.migrate)}
            onClick={handleMigrate}
            className="w-full mt-6"
            disabled={!canMigrate}
            dataAttribute={`${dataAttributePrefix}-submit-button`}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};
