import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

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
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { APPROVAL_FUNCTION } from '../../../../../constants/general';
import { translations } from '../../../../../locales/i18n';
import { fromWei, toWei } from '../../../../../utils/math';
import {
  Transaction,
  TransactionConfig,
  TransactionReceipt,
} from '../../TransactionStepDialog.types';
import {
  isSignTransactionDataRequest,
  isTransactionRequest,
} from '../../helpers';

export type TransactionStepProps = {
  transaction: Transaction;
  step: string | number;
  status: StatusType;
  config: TransactionConfig;
  receipt: TransactionReceipt;
  updateConfig: (config: TransactionConfig) => void;
  gasPrice: string;
  isLoading: boolean;
};

const chain = chains.find(chain => chain.id === defaultChainId);

export const TransactionStep: FC<TransactionStepProps> = ({
  step,
  status,
  transaction,
  config,
  receipt,
  gasPrice,
  updateConfig,
  isLoading,
}) => {
  const { request, title, subtitle } = transaction;
  const [token, setToken] = useState<TokenDetailsData | undefined>();

  useEffect(() => {
    const updateToken = (address: string) => {
      findContract(address).then(result => {
        if (result.group === 'tokens') {
          getTokenDetailsByAddress(address)
            .then(setToken)
            .catch(e => {
              console.error('token not found?', result, e);
            });
        }
      });
    };

    if (isTransactionRequest(request)) {
      const { contract } = request;
      updateToken(contract.address);
    } else if (isSignTransactionDataRequest(request)) {
      const { to } = request;
      updateToken(to);
    }
  }, [request]);

  const resetConfig = useCallback(async () => {
    if (isTransactionRequest(request)) {
      try {
        const {
          contract,
          fnName,
          args,
          gasLimit: requestGasLimit,
          gasPrice: requestGasPrice,
        } = request;
        const gasLimit =
          requestGasLimit ??
          (await contract.estimateGas[fnName](...args).then(gas =>
            gas.toString(),
          ));

        updateConfig({
          unlimitedAmount: false,
          amount: fnName === APPROVAL_FUNCTION ? args[1] : undefined,
          gasPrice: requestGasPrice ?? gasPrice,
          gasLimit,
        });
      } catch (error) {
        console.log('error', error);
      }
    } else if (isSignTransactionDataRequest(request)) {
      try {
        const {
          signer,
          data,
          to,
          gasLimit: requestGasLimit,
          gasPrice: requestGasPrice,
        } = request;

        const gasLimit =
          requestGasLimit ??
          (
            await signer.estimateGas({
              to,
              data,
            })
          ).toString();

        updateConfig({
          gasPrice: requestGasPrice ?? gasPrice,
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
    if (isTransactionRequest(request)) {
      const { fnName, args } = request;
      return fnName === APPROVAL_FUNCTION
        ? formatUnits(args[1], token?.decimalPrecision)
        : '0';
    }
    return '0';
  }, [request, token?.decimalPrecision]);

  const amountOptions = useMemo(
    () => [
      {
        label: t(translations.transactionStep.customAmount),
        name: 'settings-' + step,
        value: 'custom_amount',
        contentToShow: (
          <AmountInput
            className="mb-3 ml-8 w-64"
            disabled={!!config.unlimitedAmount}
            label={t(translations.common.amount)}
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
        helper: t(translations.transactionStep.customAmountTooltip),
      },
      {
        label: t(translations.transactionStep.unlimitedAmount),
        name: 'settings-' + step,
        value: 'unlimited_amount',
        helper: t(translations.transactionStep.unlimitedAmountTooltip),
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
            <span className="block">
              {t(translations.transactionStep.transactionFailedTitle)}
            </span>
            <span>
              {t(translations.transactionStep.transactionFailedSubtitle)}
            </span>
          </Paragraph>
        )}
        {subtitle && status !== StatusType.error && (
          <Paragraph className="text-gray-30">{subtitle}</Paragraph>
        )}

        {(isTransactionRequest(request) ||
          isSignTransactionDataRequest(request)) && (
          <>
            <SimpleTable className="max-w-72 mt-3">
              {config.amount !== undefined && (
                <SimpleTableRow
                  label={t(translations.common.amount)}
                  value={
                    config.unlimitedAmount ? (
                      '∞'
                    ) : (
                      <AmountRenderer
                        value={parsedAmount}
                        suffix={token?.symbol}
                      />
                    )
                  }
                  valueClassName={classNames(
                    isLoading || status === StatusType.success
                      ? 'text-gray-30'
                      : 'text-primary-10',
                    'whitespace-nowrap overflow-auto',
                  )}
                />
              )}
              <SimpleTableRow
                label={t(translations.transactionStep.estimatedGasFee)}
                value={
                  <AmountRenderer
                    value={estimatedGasFee}
                    suffix={BITCOIN}
                    precision={BTC_RENDER_PRECISION}
                  />
                }
                valueClassName={classNames(
                  isLoading ? 'text-gray-30' : 'text-primary-10',
                  'whitespace-nowrap overflow-auto',
                )}
              />
              {receipt.response && (
                <SimpleTableRow
                  label={t(translations.common.txId)}
                  value={
                    <TxIdWithNotification
                      href={`${chain?.blockExplorerUrl}/tx/${receipt.response}`}
                      value={receipt.response as string}
                    />
                  }
                />
              )}
            </SimpleTable>
            <Accordion
              className="mt-4 mb-3 text-xs"
              label={t(translations.common.advancedSettings)}
              open={advanced && !disabledSettings}
              onClick={() => setAdvanced(!advanced)}
              disabled={disabledSettings}
              dataAttribute="tx-dialog-settings"
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
                    {t(translations.transactionStep.gasSettings)}
                  </Heading>
                </>
              )}
              <div className="mt-2 mb-4 max-w-72">
                <AmountInput
                  label={t(translations.transactionStep.gasLimit)}
                  className="mb-4"
                  min={0}
                  value={config.gasLimit?.toString()}
                  onChange={e =>
                    updateConfig({
                      ...config,
                      gasLimit: e.target.value.replace(/[^0-9]/g, ''),
                    })
                  }
                  step="0"
                />
                <AmountInput
                  label={t(translations.transactionStep.gasPrice)}
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
                text={t(translations.transactionStep.resetValues)}
                onClick={resetConfig}
                dataAttribute="tx-dialog-settings-reset"
              />
            </Accordion>
          </>
        )}
      </div>
    </div>
  );
};
