import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import { parseUnits } from 'ethers/lib/utils';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { CrocTokenView } from '@sovryn/ambient-sdk/dist/tokens';
import { getProvider } from '@sovryn/ethers-provider';
import { ChainIds } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

// import { BOB_CHAIN_ID } from '../../../config/chains';
import { useAccount } from '../../../hooks/useAccount';
import { findAsset } from '../../../utils/asset';
import { createRangePositionTx } from './ambient-utils';

// const CHAIN_ID = BOB_CHAIN_ID;
const CHAIN_ID = ChainIds.FORK;

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

        await testAllowance(account, tokenA, 1);
        await testAllowance(account, tokenB, 1);

        const tx = await pool.initPool(price);
        console.log('init pool price: ', tx);
      } else {
        const price = await pool.displayPrice();
        console.log('display price', price);
        alert('Pool already initialized: ' + price);
      }
    },
    [account],
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

      // const approval = await tokenB.approve();
      // approval?.wait();
      // console.log('approval', approval);

      const price = await pool.displayPrice();

      console.log('display price', price);

      const TOKEN_A_AMOUNT = amount; // 0.0001
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
    },
    [account],
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
    const labels = ['ETH', 'VCT', 'SBL', 'CPL'];
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
  }, [account]);

  useEffect(() => {
    updateBalances();
  }, [account, updateBalances]);

  return (
    <div className="container flex flex-row">
      <div className="w-72">
        <ol>
          <li>
            <button onClick={() => handlePoolInit('ETH', 'VCT', 1000)}>
              Initialize pool: ETH/VCT (1000 VCT)
            </button>
            <button onClick={() => handlePoolInit('ETH', 'SBL', 500)}>
              Initialize pool: ETH/SBL (500 SBL)
            </button>
            <button onClick={() => handlePoolInit('ETH', 'CPL', 250)}>
              Initialize pool: ETH/CPL (250 CPL)
            </button>
          </li>
          <li>
            <button onClick={() => handleDeposit('ETH', 'VCT', 100)}>
              Deposit to pool: ETH/VCT (100 ETH)
            </button>
            <button onClick={() => handleDeposit('ETH', 'SBL', 100)}>
              Deposit to pool: ETH/SBL (100 ETH)
            </button>
            <button onClick={() => handleDeposit('ETH', 'CPL', 100)}>
              Deposit to pool: ETH/CPL (100 ETH)
            </button>
          </li>
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
