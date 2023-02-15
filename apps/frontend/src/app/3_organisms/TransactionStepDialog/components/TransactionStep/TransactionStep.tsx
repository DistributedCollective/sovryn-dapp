import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import {
  getTokenDetailsByAddress,
  TokenDetailsData,
  findContract,
} from '@sovryn/contracts';
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

import { APPROVAL_FUNCTION } from '../../../../../utils/constants';
import { fromWei, toWei } from '../../../../../utils/math';
import {
  Transaction,
  TxConfig,
  TxType,
} from '../../TransactionStepDialog.types';

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
  const { request } = transaction;
  const [token, setToken] = useState<TokenDetailsData | undefined>();

  useEffect(() => {
    if (transaction.request.type === TxType.signTransaction) {
      const contract = transaction.request.contract;
      findContract(contract.address).then(result => {
        if (result.group === 'tokens') {
          getTokenDetailsByAddress(contract.address).then(setToken);
        }
      });
    }
  }, [transaction.request]);

  const { title, subtitle } = transaction;

  const resetConfig = useCallback(async () => {
    if (request.type === TxType.signTransaction) {
      try {
        const gasLimit =
          request.gasLimit ??
          (await request.contract.estimateGas[request.fnName](
            ...request.args,
          ).then(gas => gas.toString()));

        updateConfig({
          unlimitedAmount: false,
          amount:
            request.fnName === APPROVAL_FUNCTION ? request.args[1] : undefined,
          gasPrice,
          gasLimit,
        });
      } catch (error) {
        console.log('error', error);
      }
    }
  }, [gasPrice, request, updateConfig]);

  const parsedAmount = useMemo(() => {
    return token?.decimalPrecision && config.amount !== undefined
      ? formatUnits(config.amount?.toString(), token?.decimalPrecision)
      : '';
  }, [config.amount, token?.decimalPrecision]);

  const minAmount = useMemo(() => {
    if (request.type === TxType.signTransaction) {
      return request.fnName === APPROVAL_FUNCTION
        ? formatUnits(request.args[1], token?.decimalPrecision)
        : '0';
    }
    return '0';
  }, [request, token?.decimalPrecision]);

  const amountOptions = useMemo(
    () => [
      {
        label: 'Custom amount',
        name: 'settings-' + step,
        value: 'custom_amount',
        contentToShow: (
          <AmountInput
            className="mb-3 ml-8 w-64"
            disabled={!!config.unlimitedAmount}
            label="Amount"
            min={minAmount}
            decimalPrecision={18}
            value={parsedAmount}
            onChange={e =>
              updateConfig({
                ...config,
                amount: parseUnits(
                  String(e.target.value),
                  token?.decimalPrecision,
                ),
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
    [
      config,
      minAmount,
      parsedAmount,
      step,
      token?.decimalPrecision,
      updateConfig,
    ],
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
      ? Number(
          fromWei(
            toWei(config.gasPrice?.toString())
              .mul(config.gasLimit?.toString())
              .div(10 ** 9),
          ),
        ).toFixed(8)
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

        {request.type === TxType.signTransaction && (
          <>
            <SimpleTable className="max-w-72 mt-3">
              {config.amount !== undefined && (
                <SimpleTableRow
                  label="Amount"
                  value={`${
                    config.unlimitedAmount ? '∞' : parsedAmount
                  } ${token?.symbol?.toUpperCase()}`}
                  valueClassName={classNames(
                    isLoading || status === StatusType.success
                      ? 'text-gray-30'
                      : 'text-primary-10',
                    'whitespace-nowrap overflow-auto',
                  )}
                />
              )}
              <SimpleTableRow
                label={
                  <span className="flex items-center">
                    Estimated gas fee
                    <HelperButton
                      className="ml-1.5"
                      content="Estimated gas fee"
                    />
                  </span>
                }
                value={estimatedGasFee + ' BTC'}
                valueClassName={classNames(
                  isLoading ? 'text-gray-30' : 'text-primary-10',
                  'whitespace-nowrap overflow-auto',
                )}
              />
              {config.hash && (
                <SimpleTableRow
                  label="TX ID"
                  value={
                    <TransactionId
                      href={`${chain?.blockExplorerUrl}/tx/${config.hash}`}
                      value={config.hash}
                    />
                  }
                />
              )}
            </SimpleTable>

            <Accordion
              className="mt-4 mb-3 text-xs"
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
              <div className="mt-2 mb-4 max-w-72">
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
          </>
        )}
      </div>
    </div>
  );
};
