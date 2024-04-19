import { MaxAllowanceTransferAmount } from '@uniswap/permit2-sdk';

import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import { BigNumber, Contract, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { getProvider } from '@sovryn/ethers-provider';
import { ChainIds } from '@sovryn/ethers-provider';
import { CrocEnv, MAX_TICK, MIN_TICK } from '@sovryn/sdex';
import { CrocTokenView } from '@sovryn/sdex/dist/tokens';
import { Decimal } from '@sovryn/utils';

import {
  Transaction,
  TransactionType,
} from '../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useAccount } from '../../../hooks/useAccount';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { findAsset } from '../../../utils/asset';
import { prepareApproveTransaction } from '../../../utils/transactions';
import { createRangePositionTx } from './ambient-utils';

const testAllowance = async (
  owner: string,
  token: CrocTokenView,
  amount: number,
) => {
  const allowance = await token.allowance(owner);
  const decimals = await token.decimals;

  const needAllowance = parseUnits(amount.toFixed(decimals), decimals);

  if (allowance.lt(needAllowance)) {
    console.log(
      'Need to approve',
      decimals,
      allowance.toString(),
      needAllowance.toString(),
    );
    const approval = await token.approve();
    return approval;
  }
};

export const BobAmmPage: React.FC = () => {
  const CHAIN_ID = useCurrentChain();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const isFork = useCallback(() => CHAIN_ID === ChainIds.FORK, [CHAIN_ID]);

  const croc = useRef<CrocEnv>();
  const { signer, account } = useAccount();

  useEffect(() => {
    if (!signer) return;
    croc.current = new CrocEnv(getProvider(CHAIN_ID), signer);
  }, [CHAIN_ID, signer]);

  const handlePoolInit = useCallback(
    async (base: string, quote: string, price: number) => {
      if (!croc.current) {
        alert('CrocEnv not initialized');
        return;
      }

      const baseToken = findAsset(base, CHAIN_ID).address;
      const quoteToken = findAsset(quote, CHAIN_ID).address;

      const tokenA = croc.current.tokens.materialize(baseToken);
      const tokenB = croc.current.tokens.materialize(quoteToken);

      // await tokenA.approveBypassRouter();
      // await tokenA.approveRouter();

      const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);
      console.log({ pool });

      const init = await pool.isInit();
      console.log('is init', init);

      if (!init) {
        console.log('need to init');

        const allowanceA = await testAllowance(account, tokenA, 1);
        const allowanceB = await testAllowance(account, tokenB, 1);

        const transactions: Transaction[] = [];

        if (allowanceA) {
          const approve = await prepareApproveTransaction({
            token: tokenA.tokenAddr,
            chain: CHAIN_ID,
            amount:
              allowanceA.weiQty === ethers.constants.MaxUint256
                ? MaxAllowanceTransferAmount
                : allowanceA.weiQty,
            spender: allowanceA.address,
            contract: new Contract(
              tokenA.tokenAddr,
              (
                await tokenA.context
              ).erc20Write.interface,
              signer,
            ),
          });
          if (approve) {
            transactions.push(approve);
          }
        }

        if (allowanceB) {
          const approve = await prepareApproveTransaction({
            token: tokenB.tokenAddr,
            chain: CHAIN_ID,
            amount:
              allowanceB.weiQty === ethers.constants.MaxUint256
                ? MaxAllowanceTransferAmount
                : allowanceB.weiQty,
            spender: allowanceB.address,
            contract: new Contract(
              tokenB.tokenAddr,
              (
                await tokenB.context
              ).erc20Write.interface,
              signer,
            ),
          });
          if (approve) {
            transactions.push(approve);
          }
        }

        const tx = await pool.initPool(price);

        console.log('init pool tx', tx);

        transactions.push({
          title: 'Deposit',
          request: {
            type: TransactionType.signTransaction,
            contract: tx.contract.connect(signer!),
            fnName: tx.fn,
            args: tx.args,
            value: tx.value ?? 0,
          },
        });

        setTransactions(transactions);
        setTitle(`Init ${base}/${quote} pool`);
        setIsOpen(true);

        console.log('init pool price: ', tx);
      } else {
        const price = await pool.displayPrice();
        console.log('display price', price);

        const xyk = await pool.xykLiquidity();
        console.log('xyk liquidity', xyk.toString());
        alert('Pool already initialized: ' + price);
      }
    },
    [CHAIN_ID, account, setIsOpen, setTitle, setTransactions, signer],
  );

  const handleDeposit = useCallback(
    async (base: string, quote: string, amount: number) => {
      if (!croc.current) {
        alert('CrocEnv not initialized');
        return;
      }

      const baseToken = findAsset(base, CHAIN_ID).address;
      const quoteToken = findAsset(quote, CHAIN_ID).address;

      const tokenA = croc.current.tokens.materialize(baseToken);
      const tokenB = croc.current.tokens.materialize(quoteToken);

      const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);
      console.log({ pool });

      const init = await pool.isInit();

      if (!init) {
        alert('Pool not initialized');
        return;
      }

      const price = await pool.displayPrice();

      console.log('display price', price.toString());

      const TOKEN_A_AMOUNT = amount; // 0.0001
      const TOKEN_B_AMOUNT = price * TOKEN_A_AMOUNT;

      console.log({ TOKEN_A_AMOUNT, TOKEN_B_AMOUNT });

      const transactions: Transaction[] = [];

      const allowanceA = await testAllowance(account, tokenA, TOKEN_A_AMOUNT);
      const allowanceB = await testAllowance(account, tokenB, TOKEN_B_AMOUNT);

      if (allowanceA) {
        const approve = await prepareApproveTransaction({
          token: tokenA.tokenAddr,
          chain: CHAIN_ID,
          amount:
            allowanceA.weiQty === ethers.constants.MaxUint256
              ? MaxAllowanceTransferAmount
              : allowanceA.weiQty,
          spender: allowanceA.address,
          contract: new Contract(
            tokenA.tokenAddr,
            (
              await tokenA.context
            ).erc20Write.interface,
            signer,
          ),
        });
        if (approve) {
          transactions.push(approve);
        }
      }

      if (allowanceB) {
        const approve = await prepareApproveTransaction({
          token: tokenB.tokenAddr,
          chain: CHAIN_ID,
          amount:
            allowanceB.weiQty === ethers.constants.MaxUint256
              ? MaxAllowanceTransferAmount
              : allowanceB.weiQty,
          spender: allowanceB.address,
          contract: new Contract(
            tokenB.tokenAddr,
            (
              await tokenB.context
            ).erc20Write.interface,
            signer,
          ),
        });
        if (approve) {
          transactions.push(approve);
        }
      }

      const tx = await createRangePositionTx({
        crocEnv: croc.current,
        isAmbient: false,
        slippageTolerancePercentage: 3,
        tokenA: {
          address: tokenA.tokenAddr,
          qty: TOKEN_A_AMOUNT,
          isWithdrawFromDexChecked: false,
        },
        tokenB: {
          address: tokenB.tokenAddr,
          qty: TOKEN_B_AMOUNT,
          isWithdrawFromDexChecked: false,
        },
        // todo: check if this need to be switched for certain cases
        isTokenAPrimaryRange: true,
        tick: { low: MIN_TICK, high: MAX_TICK },
      });

      transactions.push({
        title: 'Deposit',
        request: {
          type: TransactionType.signTransaction,
          contract: tx.contract,
          fnName: 'userCmd',
          args: [tx.path, tx.calldata],
          value: tx.txArgs?.value ? tx.txArgs.value : 0,
          gasLimit: tx.txArgs?.gasLimit
            ? tx.txArgs.gasLimit
            : BigNumber.from(6_000_000),
        },
      });

      setTransactions(transactions);
      setTitle(`Deposit liquidity to ${base}/${quote} pool`);
      setIsOpen(true);
    },
    [CHAIN_ID, account, setIsOpen, setTitle, setTransactions, signer],
  );

  const [dexBalances, setDexBalances] = useState<Record<string, Decimal>>({});
  const [walletBalances, setWalletBalances] = useState<Record<string, Decimal>>(
    {},
  );
  const [prevDexBalances, setPrevDexBalances] = useState<
    Record<string, Decimal>
  >({});
  const [prevWalletBalances, setPrevWalletBalances] = useState<
    Record<string, Decimal>
  >({});

  const updateBalances = useCallback(async () => {
    if (!croc.current) {
      return;
    }
    const labels = ['ETH', 'SOV', 'USDT', 'USDC', 'DAI', 'VCT'];
    const items = labels.map(label => findAsset(label, CHAIN_ID).address);

    const _dexBalances: Record<string, Decimal> = {};
    const _walletBalances: Record<string, Decimal> = {};

    for (let i = 0; i < items.length; i++) {
      const token = croc.current.tokens.materialize(items[i]);
      const balance = await token.balanceDisplay(account).catch(() => 0);
      const wallet = await token.walletDisplay(account).catch(() => 0);
      _dexBalances[labels[i]] = Decimal.from(balance.toString());
      _walletBalances[labels[i]] = Decimal.from(wallet.toString());
    }

    setWalletBalances(p => {
      setPrevWalletBalances(p);
      return _walletBalances;
    });
    setDexBalances(p => {
      setPrevDexBalances(p);
      return _dexBalances;
    });
  }, [CHAIN_ID, account]);

  useEffect(() => {
    updateBalances();
  }, [account, updateBalances]);

  return (
    <div className="container flex flex-row">
      <div className="w-72">
        <h1>Actions: {CHAIN_ID}</h1>
        {isFork() ? (
          <ol>
            <li>
              <button onClick={() => handlePoolInit('ETH', 'SOV', 1600)}>
                Initialize pool: ETH/SOV (1600 SOV)
              </button>
              <button onClick={() => handlePoolInit('ETH', 'USDC', 3300)}>
                Initialize pool: ETH/USDC (3300$)
              </button>
              <button onClick={() => handlePoolInit('ETH', 'USDT', 3250)}>
                Initialize pool: ETH/USDT (3250$)
              </button>
              <button onClick={() => handlePoolInit('ETH', 'DAI', 3200)}>
                Initialize pool: ETH/DAI (3200$)
              </button>
            </li>
            <li>
              <button onClick={() => handleDeposit('ETH', 'SOV', 0.000001)}>
                Deposit to pool: ETH/SOV (100 ETH)
              </button>
              <button onClick={() => handleDeposit('ETH', 'USDC', 100)}>
                Deposit to pool: ETH/USDC (100 ETH)
              </button>
              <button onClick={() => handleDeposit('ETH', 'USDT', 100)}>
                Deposit to pool: ETH/USDT (100 ETH)
              </button>
              <button onClick={() => handleDeposit('ETH', 'DAI', 100)}>
                Deposit to pool: ETH/DAI (100 ETH)
              </button>
            </li>
          </ol>
        ) : (
          <ol>
            <li>
              <button onClick={() => handlePoolInit('ETH', 'SOV', 1600)}>
                Initialize pool: ETH/SOV (1600 SOV)
              </button>
              <button onClick={() => handlePoolInit('ETH', 'USDC', 3300)}>
                Initialize pool: ETH/USDC (3300$)
              </button>
              <button onClick={() => handlePoolInit('ETH', 'USDT', 3250)}>
                Initialize pool: ETH/USDT (3250$)
              </button>
              <button onClick={() => handlePoolInit('ETH', 'DAI', 3200)}>
                Initialize pool: ETH/DAI (3200$)
              </button>
              <button onClick={() => handlePoolInit('ETH', 'VCT', 1)}>
                Initialize pool: ETH/VCT
              </button>
            </li>
            <li>
              <button onClick={() => handleDeposit('ETH', 'SOV', 0.001)}>
                Deposit to pool: ETH/SOV (0.1 ETH)
              </button>
              <button onClick={() => handleDeposit('ETH', 'USDC', 0.5)}>
                Deposit to pool: ETH/USDC (0.5 ETH)
              </button>
              <button onClick={() => handleDeposit('ETH', 'USDT', 0.5)}>
                Deposit to pool: ETH/USDT (0.5 ETH)
              </button>
              <button onClick={() => handleDeposit('ETH', 'DAI', 0.05)}>
                Deposit to pool: ETH/DAI (0.5 ETH)
              </button>
            </li>
          </ol>
        )}
      </div>
      <div className="w-72">
        <h1>Dex Balances</h1>
        <ol>
          {Object.entries(dexBalances).map(([label, balance]) => (
            <RenderBalance
              key={label}
              label={label}
              balance={balance}
              prevBalance={prevDexBalances[label]}
            />
          ))}
          <li>
            <button onClick={updateBalances} className="mt-8">
              Update Balance
            </button>
          </li>
        </ol>
      </div>
      <div className="w-72">
        <h1>Wallet Balances</h1>
        <ol>
          {Object.entries(walletBalances).map(([label, balance]) => (
            <RenderBalance
              key={label}
              label={label}
              balance={balance}
              prevBalance={prevWalletBalances[label]}
            />
          ))}

          <li>
            <button onClick={updateBalances} className="mt-8">
              Update Balance
            </button>
          </li>
        </ol>
      </div>
    </div>
  );
};

type RenderBalanceProps = {
  label: string;
  balance: Decimal;
  prevBalance?: Decimal;
};

const RenderBalance: FC<RenderBalanceProps> = ({
  label,
  balance,
  prevBalance,
}) => {
  const diff = useMemo(() => {
    if (prevBalance !== undefined && prevBalance !== balance) {
      return balance.sub(prevBalance ?? 0).toNumber();
    }
    return 0;
  }, [balance, prevBalance]);

  return (
    <li>
      {label}: {balance.toNumber()}{' '}
      {diff !== 0 ? (
        <span
          className={classNames({
            'text-error': diff < 0,
            'text-success': diff > 0,
          })}
        >
          ({diff})
        </span>
      ) : (
        <></>
      )}
    </li>
  );
};
