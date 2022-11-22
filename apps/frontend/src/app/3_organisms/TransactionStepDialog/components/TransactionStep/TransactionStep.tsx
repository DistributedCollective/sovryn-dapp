import React, { FC, useCallback, useMemo, useState } from 'react';

import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { bignumber } from 'mathjs';

import {
  Accordion,
  AmountInput,
  Button,
  ButtonType,
  ButtonStyle,
  Heading,
  HeadingType,
  Paragraph,
  RadioButtonGroup,
  SimpleTable,
  SimpleTableRow,
  StatusItem,
  StatusType,
  TransactionId,
  HelperButton,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../../../config/chains';
import { tokens } from '../../../../../config/tokens';
import { APPROVAL_FUNCTION } from '../../../../../utils/constants';
import { Transaction, TxConfig } from '../../TransactionStepDialog.types';

export type TransactionStepProps = {
  transaction: Transaction;
  step: string | number;
  status: StatusType;
  config: TxConfig;
  updateConfig: (config: TxConfig) => void;
  gasPrice: string;
  isLoading: boolean;
};

const chain = chains.find(chain => chain.id === defaultChainId);

export const TransactionStep: FC<TransactionStepProps> = ({
  step,
  status,
  transaction,
  config,
  gasPrice,
  updateConfig,
  isLoading,
}) => {
  const token = useMemo(
    () =>
      tokens.find(
        token =>
          token.address.toLowerCase() ===
          transaction.contract.address.toLowerCase(),
      ),
    [transaction.contract.address],
  );

  const { title, subtitle } = transaction;

  const resetConfig = useCallback(async () => {
    try {
      const gasLimit = await transaction.contract.estimateGas[
        transaction.fnName
      ](...transaction.args);

      updateConfig({
        ...transaction.config,
        unlimitedAmount: config.unlimitedAmount,
        amount:
          transaction.fnName === APPROVAL_FUNCTION
            ? transaction.args[1]
            : undefined,
        gasPrice,
        gasLimit: gasLimit.toString(),
      });
    } catch (error) {
      console.log('error', error);
    }
  }, [
    config.unlimitedAmount,
    gasPrice,
    transaction.args,
    transaction.config,
    transaction.contract.estimateGas,
    transaction.fnName,
    updateConfig,
  ]);

  const parsedAmount = useMemo(() => {
    return token?.decimals && config.amount !== undefined
      ? formatUnits(config.amount?.toString(), token?.decimals)
      : '';
  }, [config.amount, token?.decimals]);

  const minAmount = useMemo(() => {
    return transaction.fnName === APPROVAL_FUNCTION
      ? formatUnits(transaction.args[1], token?.decimals)
      : '0';
  }, [token?.decimals, transaction.args, transaction.fnName]);

  const amountOptions = useMemo(
    () => [
      {
        label: 'Custom amount',
        name: 'settings-' + step,
        value: 'custom_amount',
        contentToShow: (
          <AmountInput
            className="mb-3"
            disabled={!!config.unlimitedAmount}
            label="Amount"
            min={minAmount}
            decimalPrecision={18}
            value={parsedAmount}
            onChange={e =>
              updateConfig({
                ...config,
                amount: parseUnits(String(e.target.value), token?.decimals),
              })
            }
          />
        ),
        helper:
          'Limiting the amount of approved tokens as an additional security measure may result higher fees',
      },
      {
        label: 'Unlimited amount',
        name: 'settings-' + step,
        value: 'unlimited_amount',
        helper:
          'Limiting the amount of approved tokens as an additional security measure may result higher fees',
      },
    ],
    [config, minAmount, parsedAmount, step, token?.decimals, updateConfig],
  );

  const [advanced, setAdvanced] = useState(false);
  const onChange = useCallback(
    e => {
      updateConfig({
        ...config,
        unlimitedAmount: e.target.value === 'unlimited_amount',
      });
    },
    [config, updateConfig],
  );
  const disabledSettings =
    isLoading || ![StatusType.idle, StatusType.error].includes(status);

  const estimatedGasFee = useMemo(() => {
    return config.gasLimit && config.gasPrice
      ? bignumber(config.gasPrice?.toString())
          .mul(config.gasLimit?.toString())
          .div(10 ** 9)
          .toFixed(8)
      : '';
  }, [config.gasLimit, config.gasPrice]);

  return (
    <div className="flex flex-col">
      <StatusItem content={step} label={title} status={status} />
      <div className="ml-10">
        {status === StatusType.error && (
          <Paragraph className="text-error-light">
            Your transaction has failed. <br />
            Please close or retry your transaction
          </Paragraph>
        )}
        {subtitle && status !== StatusType.error && (
          <Paragraph className="text-gray-30">{subtitle}</Paragraph>
        )}
        <SimpleTable className="max-w-72 mt-3">
          {config.amount !== undefined && (
            <SimpleTableRow
              label="Amount"
              value={`${config.unlimitedAmount ? '∞' : parsedAmount} ${
                token?.symbol
              }`}
              valueClassName="text-primary-10"
            />
          )}
          <SimpleTableRow
            label={
              <span className="flex items-center">
                Estimated gas fee
                <HelperButton className="ml-1.5" content="Estimated gas fee" />
              </span>
            }
            value={estimatedGasFee + ' rBTC'}
            valueClassName="text-primary-10"
          />
          {config.hash && (
            <SimpleTableRow
              label="TX ID"
              value={
                <TransactionId
                  href={`${chain?.blockExplorerUrl}/${config.hash}`}
                  value={config.hash}
                />
              }
            />
          )}
        </SimpleTable>

        <Accordion
          className="mt-4 text-xs"
          label="Advanced Settings"
          open={advanced && !disabledSettings}
          onClick={() => setAdvanced(!advanced)}
          disabled={disabledSettings}
        >
          {config.amount !== undefined && (
            <>
              <RadioButtonGroup
                options={amountOptions}
                onChange={onChange}
                className="mt-1"
                defaultChecked={config.unlimitedAmount ? 1 : 0}
              />
              <Heading type={HeadingType.h3} className="mb-3">
                Gas Settings
              </Heading>
            </>
          )}
          <div className="mt-2 mb-4 max-w-64">
            <AmountInput
              label="Gas limit"
              className="mb-4"
              min={0}
              value={config.gasLimit?.toString()}
              onChange={e =>
                updateConfig({
                  ...config,
                  gasLimit: e.target.value,
                })
              }
              step="any"
            />
            <AmountInput
              label="Gas price"
              unit="Gwei"
              min={0}
              value={config.gasPrice?.toString()}
              onChange={e =>
                updateConfig({
                  ...config,
                  gasPrice: e.target.value,
                })
              }
              step="any"
            />
          </div>
          <Button
            style={ButtonStyle.ghost}
            type={ButtonType.reset}
            text="Reset values"
            onClick={resetConfig}
          />
        </Accordion>
      </div>
    </div>
  );
};
