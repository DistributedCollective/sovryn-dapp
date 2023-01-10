import React, { FC, useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';

import { BigNumber, ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

import {
  SupportedTokenList,
  SupportedTokens,
  getProtocolContract,
  getTokenDetails,
} from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  Select,
  SelectOption,
} from '@sovryn/ui';

import { TransactionStepDialog } from '../../3_organisms';
import { Transaction } from '../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { defaultChainId } from '../../../config/chains';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useAccount } from '../../../hooks/useAccount';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { translations } from '../../../locales/i18n';
import { formatValue, fromWei, toWei } from '../../../utils/math';

const allowedTokens = [
  SupportedTokens.dllr,
  SupportedTokens.zusd,
  SupportedTokens.doc,
];

const tokens: SelectOption<SupportedTokens>[] = SupportedTokenList.filter(
  item => allowedTokens.includes(item.symbol),
).map(token => ({
  value: token.symbol,
  label: token.symbol.toUpperCase(),
}));

const commonTranslations = translations.common;
const pageTranslations = translations.convertPage;

const ConvertPage: FC = () => {
  const { t } = useTranslation();
  const { account, signer } = useAccount();

  const [sourceAmount, setSourceAmount] = useState('0');
  const [sourceToken, setSourceToken] = useState<SupportedTokens>(
    SupportedTokens.dllr,
  );

  const destinationTokenOptions = useMemo(
    () => tokens.filter(item => item.value !== sourceToken),
    [sourceToken],
  );

  const [destinationAmount, setDestinationAmount] = useState('0');
  const [destinationToken, setDestinationToken] = useState<SupportedTokens>(
    destinationTokenOptions[0].value,
  );

  const maxSourceAmountWei = useAssetBalance(sourceToken).value;
  const maxSourceAmount = useMemo(
    () => fromWei(maxSourceAmountWei),
    [maxSourceAmountWei],
  );

  const onMaximumSourceAmountClick = useCallback(
    () => setSourceAmount(maxSourceAmount),
    [maxSourceAmount],
  );

  const onSwitchClick = useCallback(() => {
    setDestinationToken(sourceToken);
    setSourceToken(destinationToken);
    setSourceAmount('0');
    setDestinationAmount('0');
  }, [destinationToken, sourceToken]);

  useEffect(() => {
    if (sourceToken === destinationToken) {
      setDestinationToken(destinationTokenOptions[0].value);
    }
  }, [destinationToken, destinationTokenOptions, sourceToken]);

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const dllrToBasset = useCallback(async () => {
    if (!signer || sourceToken !== SupportedTokens.dllr) {
      return;
    }

    const { address, abi } = await getProtocolContract(
      'massetManager',
      defaultChainId,
    );

    const massetManager = new ethers.Contract(address, abi, signer);

    const { address: destinationTokenAddress } = await getTokenDetails(
      destinationToken,
      defaultChainId,
    );

    setTransactions([
      {
        title: 'Redeem DLLR for bAsset',
        contract: massetManager,
        fnName: 'redeemTo',
        args: [destinationTokenAddress, toWei(sourceAmount), account],
      },
    ]);

    setTitle('DLLR to bAsset conversion');
    setIsOpen(true);
  }, [
    sourceToken,
    signer,
    destinationToken,
    setTransactions,
    sourceAmount,
    account,
    setTitle,
    setIsOpen,
  ]);

  const bassetToDllr = useCallback(async () => {
    if (!signer || sourceToken === SupportedTokens.dllr) {
      return;
    }

    const { address, abi } = await getProtocolContract(
      'massetManager',
      defaultChainId,
    );

    const massetManager = new ethers.Contract(address, abi, signer);

    const { address: bassetAddress, abi: bassetAbi } = await getTokenDetails(
      sourceToken,
      defaultChainId,
    );

    const bassetToken = new ethers.Contract(bassetAddress, bassetAbi, signer);

    const allowance = await bassetToken.allowance(account, address);

    const transactions: Transaction[] = [];

    const weiSourceAmount = toWei(sourceAmount);

    if (BigNumber.from(allowance).lt(weiSourceAmount)) {
      transactions.push({
        title: 'Approve',
        contract: bassetToken,
        fnName: 'approve',
        args: [address, weiSourceAmount],
      });
    }

    transactions.push({
      title: 'Deposit bAsset for DLLR',
      contract: massetManager,
      fnName: 'mintTo',
      args: [bassetAddress, toWei(sourceAmount), account],
    });

    setTransactions(transactions);

    setTitle('bAsset to DLLR conversion');
    setIsOpen(true);
  }, [
    signer,
    sourceToken,
    account,
    sourceAmount,
    setTransactions,
    setTitle,
    setIsOpen,
  ]);

  const handleSubmit = useCallback(() => {
    sourceToken === SupportedTokens.dllr ? dllrToBasset() : bassetToDllr();
  }, [bassetToDllr, dllrToBasset, sourceToken]);

  const handleSourceAmountChange = useCallback((value: string) => {
    setSourceAmount(value);
    setDestinationAmount(value); // this could potentially change in the future if we have different conversion rates than 1:1
  }, []);

  return (
    <div className="w-full flex flex-col items-center mt-24">
      <Heading>{t(pageTranslations.title)}</Heading>
      <Paragraph className="mt-4">{t(pageTranslations.subtitle)}</Paragraph>

      <div className="mt-12 border border-gray-50 rounded w-[28rem] p-6 bg-gray-90">
        <div className="bg-gray-80 rounded p-6">
          <div className="w-full flex flex-row justify-between items-center">
            <Paragraph size={ParagraphSize.base}>
              {t(pageTranslations.form.convertFrom)}
            </Paragraph>

            <button
              onClick={onMaximumSourceAmountClick}
              className="text-gray-20 text-xs font-medium underline whitespace-nowrap"
            >
              ({t(commonTranslations.max)}{' '}
              {formatValue(Number(maxSourceAmount), 4)}{' '}
              {sourceToken.toUpperCase()})
            </button>
          </div>

          <div className="w-full flex flex-row justify-between items-center gap-3  mt-3.5">
            <AmountInput
              value={sourceAmount}
              onChangeText={handleSourceAmountChange}
              maxAmount={Number(maxSourceAmount)}
              label={t(commonTranslations.amount)}
              tooltip={t(pageTranslations.form.sourceAmountTooltip)}
              min={0}
              decimalPrecision={1}
              className="w-full flex-grow-0 flex-shrink"
            />
            <Select
              value={sourceToken}
              onChange={setSourceToken}
              options={tokens}
            />
          </div>
        </div>

        <div className="flex justify-center rounded-full -mt-3.5">
          <button
            className="w-11 h-11 rounded-full bg-gray-90 flex justify-center items-center"
            onClick={onSwitchClick}
          >
            <Icon icon={IconNames.PENDING} className="text-gray-50" size={24} />
          </button>
        </div>

        <div className="bg-gray-80 rounded p-6 -mt-3.5">
          <Paragraph size={ParagraphSize.base}>
            {t(pageTranslations.form.convertTo)}
          </Paragraph>

          <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
            <AmountInput
              value={destinationAmount}
              label={t(commonTranslations.amount)}
              tooltip={t(pageTranslations.form.destinationAmountTooltip)}
              readOnly
              className="w-full flex-grow-0 flex-shrink"
            />
            <Select
              value={destinationToken}
              onChange={setDestinationToken}
              options={destinationTokenOptions}
            />
          </div>
        </div>

        <Button
          type={ButtonType.reset}
          style={ButtonStyle.primary}
          text={t(commonTranslations.buttons.confirm)}
          className="w-full mt-8"
          onClick={handleSubmit}
        />
      </div>
      <TransactionStepDialog />
    </div>
  );
};

export default ConvertPage;
