import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { ChainIds, getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { useAccount } from '../../../hooks/useAccount';
import { createRangePositionTx } from './ambient-utils';
import { multiSwap } from './testing-swap';
import { ETH_TOKEN, OKB_TOKEN, USDC_TOKEN, WBTC_TOKEN } from './fork-constants';
import { parseUnits } from 'ethers/lib/utils';
import { CrocTokenView } from '@sovryn/ambient-sdk/dist/tokens';
import classNames from 'classnames';

// const CHAIN_ID = BOB_CHAIN_ID;
const CHAIN_ID = ChainIds.SEPOLIA;

const testAllowance = async (
  owner: string,
  token: CrocTokenView,
  amount: number,
) => {
  const allowance = await token.allowance(owner);
  const decimals = await token.decimals;

  const needAllowance = parseUnits(
    (amount + 0.00001).toFixed(decimals),
    decimals,
  );

  if (allowance.lt(needAllowance)) {
    console.log('Need to approve');
    const approval = await token.approve();
    console.log('approval', approval);
    await approval?.wait();
  }
};

export const BobAmmPage: React.FC = () => {
  const croc = useRef<CrocEnv>();
  const { signer, account } = useAccount();

  useEffect(() => {
    if (!signer) return;
    croc.current = new CrocEnv(getProvider(CHAIN_ID), signer);
  }, [signer]);

  const handlePoolInit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(ETH_TOKEN);
    const tokenB = croc.current.tokens.materialize(OKB_TOKEN);

    // await tokenA.approveBypassRouter();
    // await tokenA.approveRouter();

    const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);
    console.log({ pool });

    const init = await pool.isInit();
    console.log('is init', init);

    const price = await pool.displayPrice();
    console.log('display price', price);

    if (!init) {
      console.log('need to init');

      await testAllowance(account, tokenA, 1);
      await testAllowance(account, tokenB, 1);

      const tx = await pool.initPool(100);
      console.log('init pool price: ', tx);
    } else {
      alert('Pool already initialized');
    }
  }, [account]);

  const handleDeposit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(ETH_TOKEN);
    const tokenB = croc.current.tokens.materialize(USDC_TOKEN);

    const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);
    console.log({ pool });

    const init = await pool.isInit();

    if (!init) {
      alert('Pool not initialized');
      return;
    }

    // const approval = await tokenB.approve();
    // approval?.wait();
    // console.log('approval', approval);

    const price = await pool.displayPrice();

    console.log('display price', price);

    const TOKEN_A_AMOUNT = 0.0001; // 0.0001
    const TOKEN_B_AMOUNT = price * TOKEN_A_AMOUNT;

    console.log({ TOKEN_A_AMOUNT, TOKEN_B_AMOUNT });

    await testAllowance(account, tokenA, TOKEN_A_AMOUNT);
    await testAllowance(account, tokenB, TOKEN_B_AMOUNT);

    const tx = await createRangePositionTx({
      crocEnv: croc.current,
      isAmbient: true,
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
      isTokenAPrimaryRange: true,
      tick: { low: 2552, high: 3100 },
    });

    console.log('tx', tx);
    console.log('tx', tx?.hash);

    const receipt = await tx?.wait();
    console.log('receipt', receipt);
  }, [account]);

  const handleSwap = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(ETH_TOKEN);
    const tokenB = croc.current.tokens.materialize(USDC_TOKEN);

    const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);

    const price = await pool.displayPrice();
    console.log('price', price);

    const plan = croc.current
      .sell(tokenA.tokenAddr, 0.01)
      .for(tokenB.tokenAddr);

    console.log('plan', plan);

    const impact = await plan.impact;
    console.log({ impact });

    const slippage = plan.priceSlippage;
    console.log({ slippage });

    const tx = await plan.swap();
    console.log({ tx });

    const result = await tx.wait();
    console.log({ result });
  }, []);

  const handleDexDeposit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const token = croc.current.tokens.materialize(USDC_TOKEN);

    const tx = await token.deposit(20, account);
    console.log({ tx });

    const result = await tx?.wait();
    console.log({ result });
  }, [account]);

  const [dexBalances, setDexBalances] = useState<Record<string, number>>({});
  const [walletBalances, setWalletBalances] = useState<Record<string, number>>(
    {},
  );
  const [prevDexBalances, setPrevDexBalances] = useState<
    Record<string, number>
  >({});
  const [prevWalletBalances, setPrevWalletBalances] = useState<
    Record<string, number>
  >({});

  const updateBalances = useCallback(async () => {
    if (!croc.current) {
      return;
    }
    const labels = ['ETH', 'USDC', /*'WBTC', */ 'OKB'];
    const items = [ETH_TOKEN, USDC_TOKEN, /*WBTC_TOKEN,*/ OKB_TOKEN];

    const _dexBalances: Record<string, number> = {};
    const _walletBalances: Record<string, number> = {};

    for (let i = 0; i < items.length; i++) {
      const token = croc.current.tokens.materialize(items[i]);
      const balance = await token.balanceDisplay(account);
      const wallet = await token.walletDisplay(account);
      _dexBalances[labels[i]] = Number(balance);
      _walletBalances[labels[i]] = Number(wallet);
    }

    setWalletBalances(p => {
      setPrevWalletBalances(p);
      return _walletBalances;
    });
    setDexBalances(p => {
      setPrevDexBalances(p);
      return _dexBalances;
    });
  }, [account]);

  useEffect(() => {
    updateBalances();
  }, [account, updateBalances]);

  const handleMultihop = useCallback(
    async (buy: boolean) => {
      if (!croc.current) {
        alert('CrocEnv not initialized');
        return;
      }

      const query = (await croc.current.context).query;

      console.log({ query });

      await multiSwap(croc.current, account, buy);

      await updateBalances();
    },
    [account, updateBalances],
  );

  return (
    <div className="container flex flex-row">
      <div className="w-72">
        <ol>
          <li>
            <button onClick={handlePoolInit}>Initialize pool</button>
          </li>
          <li>
            <button onClick={handleDeposit}>Deposit to pool</button>
          </li>
          <li>
            <button onClick={handleSwap}>Swap</button>
          </li>
          <li>
            <button onClick={() => handleMultihop(true)}>
              Swap multihop (buy)
            </button>
            <button onClick={() => handleMultihop(false)}>
              Swap multihop (sell)
            </button>
          </li>
          {/* <li>
          <button onClick={handleDexDeposit}>Deposit to DEX</button>
        </li> */}
        </ol>
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
  balance: number;
  prevBalance?: number;
};

const RenderBalance: FC<RenderBalanceProps> = ({
  label,
  balance,
  prevBalance,
}) => {
  const diff = useMemo(() => {
    if (prevBalance !== undefined && prevBalance !== balance) {
      return balance - prevBalance;
    }
    return 0;
  }, [balance, prevBalance]);

  return (
    <li>
      {label}: {balance}{' '}
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
