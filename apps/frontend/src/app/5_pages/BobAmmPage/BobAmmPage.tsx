import { MaxAllowanceTransferAmount } from '@uniswap/permit2-sdk';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { BigNumber, Contract, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { getProvider } from '@sovryn/ethers-provider';
import { ChainIds } from '@sovryn/ethers-provider';
import { CrocEnv, MAX_TICK, MIN_TICK } from '@sovryn/sdex';
import { CrocTokenView } from '@sovryn/sdex/dist/tokens';
import { Button, Input } from '@sovryn/ui';

import {
  Transaction,
  TransactionType,
} from '../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useAccount } from '../../../hooks/useAccount';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { findAsset, listAssetsOfChain } from '../../../utils/asset';
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

  const tokens = useMemo(() => listAssetsOfChain(CHAIN_ID), [CHAIN_ID]);
  const [poolIndex, setPoolIndex] = useState<number>(36000);
  const [tokenA, setTokenA] = useState<string>();
  const [tokenB, setTokenB] = useState<string>();
  const [tokenAAddress, setTokenAAddress] = useState<string>();
  const [tokenBAddress, setTokenBAddress] = useState<string>();
  const [price, setPrice] = useState<number>(1);
  const [spotPrice, setSpotPrice] = useState<number>(0);
  const [testing, setTesting] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const croc = useRef<CrocEnv>();
  const { signer, account } = useAccount();

  useEffect(() => {
    if (!signer) return;
    croc.current = new CrocEnv(getProvider(CHAIN_ID), signer);
  }, [CHAIN_ID, signer]);

  useEffect(() => {
    if (!croc.current) return;
    if (!tokenA || !tokenB) return;
    setTesting(true);

    console.log('fetching pool', tokenA, tokenB);

    const baseToken = findAsset(tokenA, CHAIN_ID).address;
    const quoteToken = findAsset(tokenB, CHAIN_ID).address;

    setTokenAAddress(baseToken);
    setTokenBAddress(quoteToken);

    console.log({ baseToken, quoteToken });

    const pool = croc.current.pool(baseToken, quoteToken, poolIndex);

    pool
      .isInit()
      .then(init => {
        setIsInit(init);
        return init ? pool.displayPrice() : Promise.resolve(1);
      })
      .then(price => {
        setSpotPrice(price);
      })
      .catch(e => {
        setError(e.message);
        setIsInit(false);
        setSpotPrice(0);
      })
      .finally(() => {
        setTesting(false);
      });
  }, [tokenA, tokenB, CHAIN_ID, poolIndex]);

  const handlePoolInit = useCallback(
    async (base: string, quote: string, price: number, index: number) => {
      if (!croc.current) {
        alert('CrocEnv not initialized');
        return;
      }

      if (!signer) {
        alert('Signer not initialized');
        return;
      }

      if (!base || !quote) {
        alert('Select tokens');
        return;
      }

      const baseToken = findAsset(base, CHAIN_ID).address;
      const quoteToken = findAsset(quote, CHAIN_ID).address;

      const tokenA = croc.current.tokens.materialize(baseToken);
      const tokenB = croc.current.tokens.materialize(quoteToken);

      // await tokenA.approveBypassRouter();
      // await tokenA.approveRouter();

      const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr, index);
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

      const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr, 36000);
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
        poolIndex: 36000,
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

  return (
    <div className="container flex flex-row">
      <div className="w-72">
        <h1>Init Pool: {CHAIN_ID}</h1>
        <div className="mb-12">
          <select
            value={tokenA}
            onChange={e => setTokenA(e.target.value)}
            className="bg-black"
          >
            <option value="">Select base token</option>
            {tokens.map(token => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
          <select
            value={tokenB}
            onChange={e => setTokenB(e.target.value)}
            className="bg-black"
          >
            <option value="">Select quote token</option>
            {tokens.map(token => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
          <p>Base: {tokenAAddress}</p>
          <p>Quote: {tokenBAddress}</p>
          <p>
            Price: 1 {tokenA} = {price} {tokenB}
          </p>
          <Input
            type="number"
            value={price}
            onChangeText={val => setPrice(Number(val))}
          />

          <p>Pool Template Index:</p>
          <Input
            type="number"
            value={poolIndex}
            onChangeText={val => setPoolIndex(Number(val))}
          />
          <Button
            text="Init Pool"
            onClick={() => handlePoolInit(tokenA!, tokenB!, price, poolIndex)}
          />
          {testing && <p>loading</p>}
          {isInit ? (
            <p>Pool is created with price {spotPrice}.</p>
          ) : (
            <p>Pool is not created yet.</p>
          )}
          {error && <p className="text-danger">{error}</p>}
        </div>
        {isFork() ? (
          <>
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
          </>
        ) : (
          <ol>
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
    </div>
  );
};
