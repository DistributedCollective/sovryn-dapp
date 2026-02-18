import React, { FC, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
import {
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
  TransactionType,
  Transaction,
} from '../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useAccount } from '../../../hooks/useAccount';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { translations } from '../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../utils/asset';
import { bigNumberic, decimalic } from '../../../utils/math';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

const RUSDT_MIGRATION_CONTRACT = '0xd143f576b8e889b1c90ebef8d0c4bfbb3316fdd2';

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
  const { account, signer } = useAccount();
  const { balance, weiBalance, loading } = useAssetBalance(
    COMMON_SYMBOLS.RUSDT,
    RSK_CHAIN_ID,
  );

  // Convert rUSDT balance to the correct decimals for the migration
  const outputWeiBalance = useMemo(
    () => bigNumberic(weiBalance).div(1e12).toString(),
    [weiBalance],
  );

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasBalance = useMemo(() => balance.gt(Decimal.ZERO), [balance]);

  const canMigrate =
    !!account && !!signer && hasBalance && outputWeiBalance !== '0' && !loading;

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

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
            args: [RUSDT_MIGRATION_CONTRACT, weiBalance],
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
  }, [canMigrate, setIsOpen, setTitle, setTransactions, signer, weiBalance]);

  return (
    <>
      <Button
        style={ButtonStyle.ghost}
        size={ButtonSize.small}
        text={t(translations.rusdtMigration.cta)}
        onClick={handleOpenModal}
        className={classNames('w-auto h-auto py-0 px-0.5', buttonClassName)}
        dataAttribute={`${dataAttributePrefix}-open-button`}
      />

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
              &nbsp;&nbsp;-&gt;&nbsp;&nbsp;
              <AmountRenderer
                value={account ? decimalic(outputWeiBalance).toUnits(6) : '0'}
                suffix={COMMON_SYMBOLS.USDT}
                isAnimated
              />
            </Paragraph>
          </div>

          {!canMigrate && (
            <Paragraph size={ParagraphSize.small} className="text-gray-30 mt-3">
              {t(translations.rusdtMigration.modal.noBalance)}
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
