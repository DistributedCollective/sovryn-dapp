import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { constants } from 'ethers';
import { t } from 'i18next';

import { getProvider } from '@sovryn/ethers-provider';
import { SmartRouter, smartRoutes, SwapRoute } from '@sovryn/sdk';
import {
  AmountInput,
  Button,
  ErrorBadge,
  ErrorLevel,
  Select,
  SelectOption,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import {
  Transaction,
  TransactionType,
} from '../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { isSignTransactionDataRequest } from '../../../../3_organisms/TransactionStepDialog/helpers';
import { GAS_LIMIT } from '../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { findAsset, findAssetByAddress } from '../../../../../utils/asset';
import { fromWei } from '../../../../../utils/math';
import {
  DEFAULT_SIGNATURE,
  EMPTY_PERMIT_TRANSFER_FROM,
  permitHandler,
  prepareTypedDataTransaction,
} from '../../../../../utils/transactions';
import { useRedemptionDialog } from './useRedemptionDialog';

const MIMIMUM_AMOUNT = 200;

const zusd = findAsset('zusd', RSK_CHAIN_ID);
const dllr = findAsset('dllr', RSK_CHAIN_ID);
const btc = findAsset('btc', RSK_CHAIN_ID);

const options: SelectOption[] = [
  {
    label: zusd.symbol,
    value: zusd.address,
  },
  {
    label: dllr.symbol,
    value: dllr.address,
  },
];

export const RedemptionForm = () => {
  const { account, signer } = useAccount();
  const { setOpen } = useRedemptionDialog();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const sdk$ = useRef(
    new SmartRouter(getProvider(RSK_CHAIN_ID), [
      smartRoutes.zeroRedemptionSwapRoute,
    ]),
  );

  const route$ = useRef<SwapRoute>();

  const [entryToken, setEntryToken] = useState<string>(zusd.address);
  const [value, setAmount, amount] = useWeiAmountInput('0');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const symbol = useMemo(
    () => findAssetByAddress(entryToken, RSK_CHAIN_ID)?.symbol ?? zusd.symbol,
    [entryToken],
  );

  const { balance } = useAssetBalance(symbol, RSK_CHAIN_ID);

  useEffect(() => {
    (async () => {
      if (
        amount.lte(0) ||
        Decimal.fromBigNumberString(amount.toString()).lt(MIMIMUM_AMOUNT) ||
        !entryToken
      ) {
        setQuote(null);
        setError(null);
        return;
      }

      setLoading(true);

      await sdk$.current
        .getBestQuote(RSK_CHAIN_ID, entryToken, constants.AddressZero, amount)
        .then(result => {
          setQuote(fromWei(result.quote));
          setError(null);
          route$.current = result.route;
        })
        .catch(e => {
          setQuote(null);
          setError(e.message);
        });
    })().finally(() => setLoading(false));
  }, [amount, entryToken]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!route$.current) {
        throw new Error('No route found');
      }

      if (!account || !entryToken || !signer) {
        throw new Error('Cannot proceed without account or entry token');
      }

      setLoading(true);

      const permit = await route$.current.permit(
        entryToken,
        constants.AddressZero,
        amount,
        account,
      );

      const transactions: Transaction[] = [];

      if (permit) {
        transactions.push(await prepareTypedDataTransaction(permit, signer));
      }

      if (!permit || permit.approvalRequired) {
        const approve = await route$.current.approve(
          entryToken,
          constants.AddressZero,
          amount,
          account,
        );

        if (approve) {
          transactions.push({
            title: t(translations.convertPage.txDialog.approve, {
              asset: findAssetByAddress(entryToken, RSK_CHAIN_ID)?.symbol,
            }),
            request: {
              type: TransactionType.signTransactionData,
              signer: signer,
              to: approve.to!,
              data: approve.data!,
              gasLimit: approve.gasLimit ?? GAS_LIMIT.APPROVE,
            },
          });
        }
      }

      const swap = await route$.current.swap(
        entryToken,
        constants.AddressZero,
        amount,
        account,
        {
          typedDataValue: permit
            ? permit.typedData.values
            : EMPTY_PERMIT_TRANSFER_FROM,
          typedDataSignature: DEFAULT_SIGNATURE,
          slippage: 0.5 * 100,
        },
      );

      if (swap) {
        transactions.push({
          title: t(translations.zeroPage.redeem.tx.title, {
            symbol: btc.symbol,
          }),
          request: {
            type: TransactionType.signTransactionData,
            signer: signer,
            to: swap.to!,
            data: swap.data!,
            value: swap.value,
            gasLimit: swap?.gasLimit ?? GAS_LIMIT.CONVERT,
            gasPrice: swap?.gasPrice?.toString(),
          },
          updateHandler: permitHandler(async (req, res) => {
            if (isSignTransactionDataRequest(req)) {
              if (!!permit && route$.current) {
                const { data } = await route$.current.swap(
                  entryToken,
                  constants.AddressZero,
                  amount,
                  account,
                  {
                    typedDataValue: permit.typedData.values,
                    typedDataSignature: res as string,
                    slippage: 0.5 * 100,
                  },
                );
                req.data = data!;
              }
            }
            return req;
          }),
          onComplete: () => setOpen(false),
        });
      }

      setTransactions(transactions);
      setTitle(
        t(translations.zeroPage.redeem.tx.title, {
          symbol: btc.symbol,
        }),
      );
      setIsOpen(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [
    account,
    amount,
    entryToken,
    setIsOpen,
    setOpen,
    setTitle,
    setTransactions,
    signer,
  ]);

  const getAssetRenderer = useCallback(
    (token: string) => (
      <AssetRenderer
        showAssetLogo
        asset={findAssetByAddress(token, RSK_CHAIN_ID).symbol}
        chainId={RSK_CHAIN_ID}
        assetClassName="font-medium"
      />
    ),
    [],
  );

  const canSubmit = useMemo(() => {
    const value = Decimal.fromBigNumberString(amount.toString());
    return (
      !loading &&
      !error &&
      value.gte(MIMIMUM_AMOUNT) &&
      !!quote &&
      value.lte(balance)
    );
  }, [amount, loading, error, quote, balance]);

  return (
    <>
      <div className="p-2 bg-gray-90 mb-4 rounded">
        {t(translations.zeroPage.redeem.form.description)}{' '}
        <a
          href="https://wiki.sovryn.com/en/sovryn-dapp/using-zero#liquidations-and-redemptions"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(translations.zeroPage.redeem.form.link)}
        </a>
      </div>
      <div className="w-full flex justify-between items-center gap-x-4 mb-2">
        <div>
          {t(translations.zeroPage.redeem.form.minimum, {
            value: MIMIMUM_AMOUNT,
            symbol,
          })}
        </div>
        <div>
          <MaxButton
            token={symbol}
            value={balance}
            onClick={() => setAmount(balance.toString())}
          />
        </div>
      </div>
      <div className="w-full flex justify-between items-center gap-x-4">
        <AmountInput value={value} onChangeText={setAmount} />
        <Select
          options={options}
          value={entryToken}
          onChange={setEntryToken}
          labelRenderer={() => getAssetRenderer(entryToken)}
        />
      </div>

      {quote && (
        <div className="mt-1">
          <AmountRenderer value={quote} suffix={btc.symbol} />
        </div>
      )}

      {error && <ErrorBadge level={ErrorLevel.Critical} message={error} />}

      <Button
        className="w-full mt-4"
        onClick={handleSubmit}
        text="Confirm"
        disabled={!canSubmit}
        loading={loading}
      />
    </>
  );
};
